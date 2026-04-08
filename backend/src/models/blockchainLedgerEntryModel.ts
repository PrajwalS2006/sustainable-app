import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockchainLedgerEntry extends Document {
  movementId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;

  movementUniqueKey: string; // used on-chain
  movementHash: string; // bytes32 hex: 0x....

  txHash: string;
  blockNumber?: number;
  chainId?: number;

  createdAt: Date;
}

const BlockchainLedgerEntrySchema = new Schema<IBlockchainLedgerEntry>(
  {
    movementId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplyChainMovement', required: true, unique: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },

    movementUniqueKey: { type: String, required: true, unique: true, index: true },
    movementHash: { type: String, required: true },

    txHash: { type: String, required: true },
    blockNumber: { type: Number, required: false },
    chainId: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBlockchainLedgerEntry>('BlockchainLedgerEntry', BlockchainLedgerEntrySchema);

