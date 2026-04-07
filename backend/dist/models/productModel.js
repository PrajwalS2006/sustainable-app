// backend/src/models/productModel.ts
import mongoose, { Schema, Document } from 'mongoose';
const ProductSchema = new Schema({
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
export default mongoose.model('Product', ProductSchema);
//# sourceMappingURL=productModel.js.map