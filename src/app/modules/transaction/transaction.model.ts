import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    newBalance: { type: Number, required: true },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
