/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: Types.ObjectId;
  user: Types.ObjectId; // ref to User
  balance: number;
  isBlocked: WalletStatus;
  createdAt?: Date;
}

