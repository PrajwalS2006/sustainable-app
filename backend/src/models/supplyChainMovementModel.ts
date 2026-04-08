import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplyChainMovement extends Document {
  productId: mongoose.Types.ObjectId;
  fromActorId: mongoose.Types.ObjectId;
  toActorId: mongoose.Types.ObjectId;

  quantity: number;
  movementType: string; // e.g. "raw_material", "manufacturing", "distribution"
  notes?: string;

  occurredAt: Date;
  evidenceUrl?: string;
  evidenceHash?: string; // optional sha256/bytes32 hex

  // Unique key tied to blockchain entry (productId + movementId)
  movementUniqueKey: string;
  movementHash: string; // bytes32 hex string: 0x....

  // Blockchain metadata
  blockchainTxHash?: string;
  blockchainBlockNumber?: number;
  isVerifiedOnChain: boolean;

  // Heuristic anomaly detection
  anomalyScore: number; // 0..1
  anomalyReasons: string[];
  anomalyFlagged: boolean;
  needsReview: boolean;

  createdAt: Date;
}

const SupplyChainMovementSchema = new Schema<ISupplyChainMovement>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    fromActorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor', required: true, index: true },
    toActorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor', required: true, index: true },

    quantity: { type: Number, required: true, min: 0 },
    movementType: { type: String, required: true, trim: true, default: 'movement' },
    notes: { type: String, required: false, trim: true },

    occurredAt: { type: Date, required: true },
    evidenceUrl: { type: String, required: false, trim: true },
    evidenceHash: { type: String, required: false, trim: true },

    movementUniqueKey: { type: String, required: true, unique: true, index: true },
    movementHash: { type: String, required: true },

    blockchainTxHash: { type: String, required: false, index: true },
    blockchainBlockNumber: { type: Number, required: false },
    isVerifiedOnChain: { type: Boolean, default: false },

    anomalyScore: { type: Number, default: 0 },
    anomalyReasons: { type: [String], default: [] },
    anomalyFlagged: { type: Boolean, default: false },
    needsReview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISupplyChainMovement>('SupplyChainMovement', SupplyChainMovementSchema);

