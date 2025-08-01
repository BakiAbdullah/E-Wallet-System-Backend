import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
      required: true,
    },
    isBlocked: {
        type: String,
        enum: Object.values(WalletStatus),
        default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const Wallet = model<IWallet>("Wallet", walletSchema);