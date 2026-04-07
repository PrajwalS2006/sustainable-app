// backend/src/models/userModel.ts
import mongoose, { Schema, Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  purchasedProducts: Array<{
    productId: mongoose.Types.ObjectId;
    purchaseDate: Date;
    quantity: number;
  }>;
  ecoScore: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 }
  }],
  ecoScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);