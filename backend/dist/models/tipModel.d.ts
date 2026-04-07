import mongoose, { Document } from 'mongoose';
export interface ITip extends Document {
    tipText: string;
    category: string;
}
declare const _default: mongoose.Model<ITip, {}, {}, {}, mongoose.Document<unknown, {}, ITip> & ITip & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=tipModel.d.ts.map