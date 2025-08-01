/* eslint-disable no-unused-vars */
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser; // ref to User
  balance: number;
  isBlocked: WalletStatus;
  createdAt?: Date;
}

