import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=userModel.d.ts.map