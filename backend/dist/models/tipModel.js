// backend/src/models/tipModel.ts
import mongoose, { Schema, Document } from 'mongoose';
const TipSchema = new Schema({
    tipText: { type: String, required: true },
    category: { type: String, required: true }
});
export default mongoose.model('Tip', TipSchema);
//# sourceMappingURL=tipModel.js.map