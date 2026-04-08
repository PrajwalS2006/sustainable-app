import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import Product from '../models/productModel';
import Actor from '../models/actorModel';
import SupplyChainMovement from '../models/supplyChainMovementModel';
import BlockchainLedgerEntry from '../models/blockchainLedgerEntryModel';
import VerificationLog, { type VerificationStatus } from '../models/verificationLogModel';

import { scoreMovementAnomaly } from '../anomaly/anomalyDetector';
import { sha256ToBytes32Hex, stableStringify } from '../utils/hash';
import { recordMovementOnChain, verifyMovementOnChain } from '../blockchain/blockchainService';

const movementCreateSchema = z.object({
  fromActorId: z.string().min(1),
  toActorId: z.string().min(1),
  quantity: z.coerce.number().positive(),
  movementType: z.string().min(1).default('movement'),
  notes: z.string().optional(),
  occurredAt: z.coerce.date().optional(),
  evidenceUrl: z.string().url().optional(),
  evidenceHash: z
    .string()
    .optional()
    .refine((v) => (v ? /^[0-9a-fA-Fx]+$/.test(v) : true), 'evidenceHash must be a hex string'),
});

async function logVerification(params: {
  movementId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  status: VerificationStatus;
  reason: string;
  details?: Record<string, unknown>;
}) {
  // Persist verification/audit logs for later review.
  await VerificationLog.create({
    movementId: params.movementId,
    productId: params.productId,
    status: params.status,
    reason: params.reason,
    details: params.details,
  });

  // Also log to server stdout to support operational debugging.
  console.warn(
    `[SDG7][Verification] movement=${params.movementId.toString()} status=${params.status} reason=${params.reason}`
  );
}

export async function addSupplyChainMovement(req: Request, res: Response): Promise<void> {
  try {
    const productId = req.params.productId;
    if (!mongoose.isValidObjectId(productId)) {
      res.status(400).json({ message: 'Invalid productId' });
      return;
    }

    const parsed = movementCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request body', error: parsed.error.flatten() });
      return;
    }

    const {
      fromActorId,
      toActorId,
      quantity,
      movementType,
      notes,
      occurredAt,
      evidenceUrl,
      evidenceHash,
    } = parsed.data;

    if (!mongoose.isValidObjectId(fromActorId) || !mongoose.isValidObjectId(toActorId)) {
      res.status(400).json({ message: 'Invalid fromActorId/toActorId' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const [fromActor, toActor] = await Promise.all([Actor.findById(fromActorId), Actor.findById(toActorId)]);
    if (!fromActor || !toActor) {
      res.status(404).json({ message: 'Actor not found' });
      return;
    }

    const movementId = new mongoose.Types.ObjectId();
    const movementUniqueKey = `${productId}:${movementId.toString()}`;

    const occurred = occurredAt ? occurredAt : new Date();

    // Canonical payload ensures the movement hash is stable and reproducible.
    const canonicalPayload = stableStringify({
      productId,
      movementUniqueKey,
      fromActorId,
      toActorId,
      quantity,
      movementType,
      notes: notes ?? null,
      occurredAt: occurred.toISOString(),
      evidenceUrl: evidenceUrl ?? null,
      evidenceHash: evidenceHash ?? null,
    });

    const movementHash = sha256ToBytes32Hex(canonicalPayload);

    const previousMovementsForProduct = await SupplyChainMovement.find({ productId })
      .sort({ occurredAt: 1 })
      .select('occurredAt')
      .lean();

    const anomaly = scoreMovementAnomaly({
      movement: {
        quantity,
        movementType,
        notes,
        occurredAt: occurred,
        evidenceUrl,
        evidenceHash,
      },
      fromActorType: fromActor.actorType,
      toActorType: toActor.actorType,
      previousMovementsForProduct: previousMovementsForProduct.map((m: any) => ({ occurredAt: m.occurredAt })),
    });

    // Create movement record first so that the id is deterministic for hashing.
    const movement = await SupplyChainMovement.create({
      _id: movementId,
      productId: product._id,
      fromActorId: fromActor._id,
      toActorId: toActor._id,

      quantity,
      movementType,
      notes,
      occurredAt: occurred,
      evidenceUrl,
      evidenceHash,

      movementUniqueKey,
      movementHash,

      anomalyScore: anomaly.anomalyScore,
      anomalyReasons: anomaly.anomalyReasons,
      anomalyFlagged: anomaly.anomalyFlagged,
      needsReview: anomaly.needsReview,

      // Blockchain fields filled after on-chain recording.
      isVerifiedOnChain: false,
    });

    // Record tamper-proof movement hash on-chain.
    const onChain = await recordMovementOnChain({
      uniqueKey: movementUniqueKey,
      movementHash,
    });

    movement.blockchainTxHash = onChain.txHash;
    movement.blockchainBlockNumber = onChain.blockNumber;
    movement.isVerifiedOnChain = onChain.onChainVerified;

    await movement.save();

    // Persist ledger entry for quick lookup.
    await BlockchainLedgerEntry.create({
      movementId: movement._id,
      productId: product._id,
      movementUniqueKey,
      movementHash,
      txHash: movement.blockchainTxHash || onChain.txHash,
      blockNumber: movement.blockchainBlockNumber,
    });

    // Data trust verification + operational alerting.
    if (movement.isVerifiedOnChain) {
      await logVerification({
        movementId: movement._id,
        productId: product._id,
        status: movement.needsReview || movement.anomalyFlagged ? 'suspicious' : 'verified',
        reason: movement.needsReview || movement.anomalyFlagged ? 'Verified on-chain but flagged by anomaly rules.' : 'Verified on-chain.',
        details: {
          anomalyScore: movement.anomalyScore,
          anomalyReasons: movement.anomalyReasons,
          txHash: movement.blockchainTxHash,
        },
      });
    } else {
      await logVerification({
        movementId: movement._id,
        productId: product._id,
        status: 'unverified',
        reason: 'Movement hash could not be verified against blockchain.',
        details: {
          txHash: movement.blockchainTxHash,
          expectedMovementHash: movement.movementHash,
          uniqueKey: movement.movementUniqueKey,
        },
      });
    }

    res.status(201).json({
      movement: {
        id: movement._id,
        productId: movement.productId,
        fromActorId: movement.fromActorId,
        toActorId: movement.toActorId,
        quantity: movement.quantity,
        movementType: movement.movementType,
        notes: movement.notes,
        occurredAt: movement.occurredAt,
        evidenceUrl: movement.evidenceUrl,
        movementUniqueKey: movement.movementUniqueKey,
        movementHash: movement.movementHash,
        blockchainTxHash: movement.blockchainTxHash,
        isVerifiedOnChain: movement.isVerifiedOnChain,
        anomalyScore: movement.anomalyScore,
        anomalyReasons: movement.anomalyReasons,
        anomalyFlagged: movement.anomalyFlagged,
        needsReview: movement.needsReview,
      },
    });
  } catch (error) {
    console.error('[SDG7][SupplyChain][addSupplyChainMovement] error:', error);
    res.status(500).json({ message: 'Failed to record supply chain movement', error: error instanceof Error ? error.message : String(error) });
  }
}

export async function getSupplyChainGraph(req: Request, res: Response): Promise<void> {
  try {
    const productId = req.params.productId;
    if (!mongoose.isValidObjectId(productId)) {
      res.status(400).json({ message: 'Invalid productId' });
      return;
    }

    const verify = req.query.verify === 'true';

    const movements = await SupplyChainMovement.find({ productId })
      .sort({ occurredAt: 1 })
      .populate('fromActorId toActorId')
      .lean();

    const nodesById: Record<string, any> = {};
    const edges: any[] = [];

    for (const m of movements as any[]) {
      const fromActor = m.fromActorId;
      const toActor = m.toActorId;
      if (fromActor?._id) nodesById[String(fromActor._id)] = { id: String(fromActor._id), actorType: fromActor.actorType, name: fromActor.name };
      if (toActor?._id) nodesById[String(toActor._id)] = { id: String(toActor._id), actorType: toActor.actorType, name: toActor.name };

      let isVerified = !!m.isVerifiedOnChain;
      if (verify && m.movementUniqueKey && m.movementHash) {
        // Re-check blockchain for extra trust verification.
        const verifiedNow = await verifyMovementOnChain({
          uniqueKey: m.movementUniqueKey,
          expectedMovementHash: m.movementHash,
        });
        isVerified = verifiedNow;
      }

      const suspicious = !isVerified || !!m.needsReview || !!m.anomalyFlagged;
      edges.push({
        movementId: String(m._id),
        from: String(fromActor?._id || m.fromActorId),
        to: String(toActor?._id || m.toActorId),
        occurredAt: m.occurredAt,
        quantity: m.quantity,
        movementType: m.movementType,
        notes: m.notes,
        evidenceUrl: m.evidenceUrl,
        movementHash: m.movementHash,
        blockchainTxHash: m.blockchainTxHash,
        isVerifiedOnChain: isVerified,
        anomalyScore: m.anomalyScore,
        anomalyReasons: m.anomalyReasons,
        anomalyFlagged: m.anomalyFlagged,
        needsReview: m.needsReview,
        suspicious,
      });
    }

    res.json({
      productId,
      nodes: Object.values(nodesById),
      edges,
    });
  } catch (error) {
    console.error('[SDG7][SupplyChain][getSupplyChainGraph] error:', error);
    res.status(500).json({ message: 'Failed to load supply chain graph', error: error instanceof Error ? error.message : String(error) });
  }
}

export async function getSupplyChainAnomalies(req: Request, res: Response): Promise<void> {
  try {
    const productId = req.params.productId;
    if (!mongoose.isValidObjectId(productId)) {
      res.status(400).json({ message: 'Invalid productId' });
      return;
    }

    const movements = await SupplyChainMovement.find({ productId, $or: [{ needsReview: true }, { anomalyFlagged: true }, { isVerifiedOnChain: false }] })
      .sort({ createdAt: -1 })
      .populate('fromActorId toActorId')
      .lean();

    res.json({
      productId,
      anomalies: movements.map((m: any) => ({
        movementId: String(m._id),
        fromActor: m.fromActorId ? { id: String(m.fromActorId._id), name: m.fromActorId.name, actorType: m.fromActorId.actorType } : undefined,
        toActor: m.toActorId ? { id: String(m.toActorId._id), name: m.toActorId.name, actorType: m.toActorId.actorType } : undefined,
        occurredAt: m.occurredAt,
        quantity: m.quantity,
        movementType: m.movementType,
        isVerifiedOnChain: m.isVerifiedOnChain,
        anomalyScore: m.anomalyScore,
        anomalyReasons: m.anomalyReasons,
        anomalyFlagged: m.anomalyFlagged,
        needsReview: m.needsReview,
        blockchainTxHash: m.blockchainTxHash,
        evidenceUrl: m.evidenceUrl,
      })),
    });
  } catch (error) {
    console.error('[SDG7][SupplyChain][getSupplyChainAnomalies] error:', error);
    res.status(500).json({ message: 'Failed to load anomalies', error: error instanceof Error ? error.message : String(error) });
  }
}

export async function listActors(_req: Request, res: Response): Promise<void> {
  try {
    const actors = await Actor.find().sort({ actorType: 1, name: 1 }).lean();
    res.json({ actors });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load actors',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

