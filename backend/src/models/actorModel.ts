import mongoose, { Document, Schema } from 'mongoose';

export type ActorType = 'supplier' | 'manufacturer' | 'distributor' | 'retailer' | 'consumer';

export interface IActor extends Document {
  actorType: ActorType;
  name: string;
  location?: string;
  createdAt: Date;
}

const ActorSchema = new Schema<IActor>(
  {
    actorType: {
      type: String,
      enum: ['supplier', 'manufacturer', 'distributor', 'retailer', 'consumer'],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IActor>('Actor', ActorSchema);

