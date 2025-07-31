/* eslint-disable no-unused-vars */

import { Types } from "mongoose";

export enum TransactionType {
  TOP_UP = "TOP_UP",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND_MONEY",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export interface ITransaction {
  newBalance: number;
  amount: number;
  transactionType: TransactionType;
  sender: Types.ObjectId | string;
  receiver: Types.ObjectId | string;
  wallet: Types.ObjectId | string;
  status: TransactionStatus;
}
