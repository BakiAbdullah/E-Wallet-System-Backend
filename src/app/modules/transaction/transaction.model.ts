import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
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
