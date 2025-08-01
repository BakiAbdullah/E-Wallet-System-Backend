/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { Role } from "../user/user.validation";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";

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

    const wallet = await Wallet.findOne({ user: userId })
      .populate("user", "role")
      .session(session);

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // ✅ AGENT can only top-up USER (not AGENT or ADMIN)
    if ((wallet.user as any).role !== Role.USER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agents can only top-up regular user accounts"
      );
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

    // Create a transaction record
    await Transaction.create(
      [
        {
          wallet: wallet._id,
          newBalance: wallet.balance,
          amount: amount,
          transactionType: TransactionType.TOP_UP,
          sender: userId,
          receiver: userId, // In case of top-up, sender and receiver are the same
          status: TransactionStatus.SUCCESS,
        },
      ],
      { new: true, runValidators: true, session }
    );

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

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }


    if (!amount || amount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Amount must be greater than zero"
      );
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

    // Create a transaction record (optional, if you want to track transactions)
    await Transaction.create(
      [
        {
          wallet: wallet._id,
          newBalance: wallet.balance,
          amount: amount,
          transactionType: TransactionType.WITHDRAW,
          sender: userId,
          receiver: userId, // In case of withdrawal, sender and receiver are the same
          status: TransactionStatus.SUCCESS,
        },
      ],
      { new: true, runValidators: true, session }
    );

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

    // Create a transaction record (optional, if you want to track transactions)
    await Transaction.create(
      [
        {
          wallet: recipientWallet._id,
          newBalance: recipientWallet.balance,
          amount: amount,
          transactionType: TransactionType.SEND,
          sender: senderWallet._id,
          receiver: recipientWallet.user,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { new: true, runValidators: true, session }
    );

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

const blockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.isBlocked === WalletStatus.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is already blocked");
  }

  wallet.isBlocked = WalletStatus.BLOCKED;
  await wallet.save();
};

export const WalletServices = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
  blockWallet,
};
