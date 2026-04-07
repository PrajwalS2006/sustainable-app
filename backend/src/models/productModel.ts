// backend/src/models/productModel.ts
import mongoose, { Schema, Document } from 'mongoose';

// Product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  ecoScore: number; // 0-100, higher is better
  imageUrl: string;
  price: number;
  carbonFootprint: number; // kg CO2
  waterUsage: number; // liters
  recyclable: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ecoScore: { type: Number, required: true, min: 0, max: 100 },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  carbonFootprint: { type: Number, required: true },
  waterUsage: { type: Number, required: true },
  recyclable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);