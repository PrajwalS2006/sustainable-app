import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description: string;
    category: string;
    ecoScore: number;
    imageUrl: string;
    price: number;
    carbonFootprint: number;
    waterUsage: number;
    recyclable: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=productModel.d.ts.map