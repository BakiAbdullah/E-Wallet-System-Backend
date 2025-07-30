/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
/*
    ✅ 2. Wallet Features (Implement core wallet functionalities)
    - Top-up wallet
    - Withdraw from wallet
    - Send money to another wallet
    - View my wallet balance
    - View transaction history

/** ✅ Validation:
 * - Blocked wallets can’t transact
 * - Insufficient balance checks
 * - No negative/0 amount
 */

import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";

const topUpWallet = async (amount: number, userId: string) => {

  if (!amount || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Amount must be greater than zero"
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (wallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Wallet is blocked, you can’t Add Money!"
      );
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { message: "Top-up successful", balance: wallet.balance };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to top up wallet",
      error.message
    );
  }
};

const withdrawFromWallet = async () => {
  return "";
};

const sendMoney = async () => {
  return "";
};

const getMyWallet = async () => {
  return "";
};

export const WalletServices = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
};
