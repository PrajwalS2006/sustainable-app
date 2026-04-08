import type { ActorType } from '../models/actorModel';
import type { ISupplyChainMovement } from '../models/supplyChainMovementModel';

export interface AnomalyScoreResult {
  anomalyScore: number; // 0..1
  anomalyReasons: string[];
  anomalyFlagged: boolean;
  needsReview: boolean;
}

const ALLOWED_STAGE_SEQUENCE: ActorType[] = [
  'supplier',
  'manufacturer',
  'distributor',
  'retailer',
  'consumer',
];

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Heuristic "AI-based" anomaly scoring:
 * - This is rule/score based (no heavy ML deps) but produces review flags and reasons.
 * - Rules are designed to be deterministic + auditable.
 */
export function scoreMovementAnomaly(params: {
  movement: Pick<ISupplyChainMovement, 'quantity' | 'movementType' | 'notes' | 'occurredAt' | 'evidenceUrl' | 'evidenceHash'>;
  fromActorType: ActorType;
  toActorType: ActorType;
  previousMovementsForProduct: Array<{ occurredAt: Date }>;
}): AnomalyScoreResult {
  const reasons: string[] = [];
  let score = 0;

  // 1) Evidence requirements
  if (!params.movement.evidenceUrl && !params.movement.evidenceHash) {
    score += 0.45;
    reasons.push('Missing evidence (no evidenceUrl/evidenceHash).');
  }

  // 2) Quantity sanity
  if (!Number.isFinite(params.movement.quantity) || params.movement.quantity <= 0) {
    score += 0.35;
    reasons.push('Invalid quantity (must be > 0).');
  }

  // 3) Unlikely time gaps
  const prev = params.previousMovementsForProduct?.slice().sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()).pop();
  if (prev) {
    const deltaMs = Math.abs(params.movement.occurredAt.getTime() - prev.occurredAt.getTime());
    const deltaDays = deltaMs / (1000 * 60 * 60 * 24);
    if (deltaDays > 90) {
      score += 0.15;
      reasons.push(`Unusual time gap from previous movement (${Math.round(deltaDays)} days).`);
    }
  }

  // 4) Stage progression (supply chain should generally follow the stage order)
  const fromIdx = ALLOWED_STAGE_SEQUENCE.indexOf(params.fromActorType);
  const toIdx = ALLOWED_STAGE_SEQUENCE.indexOf(params.toActorType);
  if (fromIdx !== -1 && toIdx !== -1) {
    // Allow staying in same stage (sometimes re-work occurs), but not backwards by more than one.
    if (toIdx < fromIdx) {
      score += 0.25;
      reasons.push(`Stage regression: ${params.fromActorType} -> ${params.toActorType}.`);
    }
  }

  // 5) Review thresholding
  score = clamp01(score);
  const anomalyFlagged = score >= 0.5;
  const needsReview = score >= 0.6;

  return {
    anomalyScore: score,
    anomalyReasons: reasons,
    anomalyFlagged,
    needsReview,
  };
}

