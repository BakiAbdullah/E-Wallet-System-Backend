/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { Role } from "../user/user.validation";

/*
    ✅ 2. Wallet Features (Implement core wallet functionalities)
    - Top-up wallet
    - Withdraw from wallet
    - Send money to another wallet
    - View my wallet balance
    - View transaction history
 */

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
        "Wallet is blocked, you can not Add Money!"
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

const withdrawFromWallet = async (amount: number, userId: string) => {
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

    if (!amount || amount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Amount must be greater than zero"
      );
    }

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (wallet.balance < amount || wallet.balance === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance!"
      );
    }
    if (!Object.values(Role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to withdraw money!"
      );
    }

    if (wallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Wallet is blocked, you can not withdraw money!"
      );
    }

    // Update wallet balance
    wallet.balance -= amount;
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();
    return { message: "Cash Out successful", balance: wallet.balance };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to Cash Out or withdraw money!",
      error.message
    );
  }
};

const sendMoney = async (
  senderWalletId: string,
  recipientWalletId: string,
  amount: number
) => {
  if (!amount || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Amount must be greater than zero"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // >>> Get sender's wallet
    const senderWallet = await Wallet.findOne({ user: senderWalletId }).session(
      session
    );

    if (!senderWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    }

    // Check if sender is sending to own wallet
    if (senderWallet._id.toString() === recipientWalletId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot send money to your own wallet!"
      );
    }

    if (senderWallet.balance < amount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance!"
      );
    }

    if (senderWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Wallet is blocked, you can not send money!"
      );
    }

    // >>> Get recipient wallet
    const recipientWallet = await Wallet.findById(recipientWalletId).session(
      session
    );

    if (!recipientWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
    }

    if (recipientWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Recipient wallet is blocked, you can not send money!"
      );
    }

    // Send money to recipient wallet
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    await session.commitTransaction();
    session.endSession();
    return {
      message: "Send Money successful",
      senderBalance: senderWallet.balance,
      recipientBalance: recipientWallet.balance,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to send money!",
      error.message
    );
  }
};

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

export const WalletServices = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
};
