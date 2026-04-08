import mongoose, { Document, Schema } from 'mongoose';

export type VerificationStatus = 'verified' | 'unverified' | 'suspicious';

export interface IVerificationLog extends Document {
  movementId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  status: VerificationStatus;
  reason: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const VerificationLogSchema = new Schema<IVerificationLog>(
  {
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplyChainMovement', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    status: { type: String, enum: ['verified', 'unverified', 'suspicious'], required: true, index: true },
    reason: { type: String, required: true, trim: true },
    details: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IVerificationLog>('VerificationLog', VerificationLogSchema);

