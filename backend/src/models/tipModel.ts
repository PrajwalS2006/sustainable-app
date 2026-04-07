// backend/src/models/tipModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITip extends Document {
  tipText: string;
  category: string;
}

const TipSchema = new Schema<ITip>({
  tipText: { type: String, required: true },
  category: { type: String, required: true }
});

export default mongoose.model<ITip>('Tip', TipSchema);