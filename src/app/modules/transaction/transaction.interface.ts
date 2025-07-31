/* eslint-disable no-unused-vars */

export enum TransactionType {
  TOP_UP = "TOP_UP",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export interface ITransaction {
  amount: number;
  transactionType: TransactionType;
  sender: string;
  receiver: string;
  status: TransactionStatus;
  wallet: string;
}
