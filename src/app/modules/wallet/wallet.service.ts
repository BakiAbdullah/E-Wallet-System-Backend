/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { WalletStatus } from "./wallet.interface";
import { Role } from "../user/user.validation";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { IUser } from "../user/user.interface";
import { getTransactionId } from "../../utils/getTransactionID";
import { User } from "../user/user.model";

// Top up a user's wallet
const topUpWallet = async (amount: number, agentId: string, userId: string) => {
  const transactionId = getTransactionId();

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
      .populate<{ user: IUser }>("user")
      .session(session);
    // agent wallet
    const agentWallet = await Wallet.findOne({ user: agentId })
      .populate<{ user: IUser }>("user")
      .session(session);
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Check if the user is an agent and not approved
    if (wallet.user.role === Role.AGENT && wallet.user.isApproved === false) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your agent account is not approved yet, you can not perform any transactions!"
      );
    }

    //! User can not top up Agent's wallet
    // if (
    //   wallet.user.role === Role.USER &&
    //   agentWallet.user?.role === Role.AGENT
    // ) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     "Users are not allowed to top up an agent's wallet!"
    //   );
    // }

    if (wallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Wallet is blocked, you can not Add Money!"
      );
    }

    if (wallet.balance - amount < 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance!");
    }

    // Check if agent wallet is blocked
    if (agentWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agent wallet is blocked, you can not withdraw money!"
      );
    }

    // New Rule to Top up from Agent and prevent user to top up Agent's wallet
    if (wallet.user.role === Role.AGENT) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Users are not allowed to top up an agent's wallet!"
      );
    }

    if (
      wallet.user.role === Role.USER &&
      agentWallet.user.role === Role.AGENT
    ) {
      // টপ আপ সবসময় USER এর wallet এ হবে,
      // Agent শুধু transaction facilitate করবে
      // তাই এখানে agent এর balance increase হবে না।

      // Rule enforce
      // Ensure: আমরা user এর wallet এ টাকা যোগ করছি, agent এর টাতে না।

      // Agent এর wallet untouched থাকবে
      // Top up receiver's wallet
      wallet.balance += amount;
      await wallet.save();
    }

    // If agent is not topping up their own wallet
    if (agentWallet._id.toString() !== wallet._id.toString()) {
      // Subtract from agent's wallet
      agentWallet.balance -= amount;

      // Check for insufficient balance
      if (agentWallet.balance < 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Agent has insufficient balance!"
        );
      }

      await agentWallet.save({ session });
    }
    await wallet.save({ session });

    // Create a transaction record
    await Transaction.create(
      [
        {
          wallet: wallet._id,
          newBalance: wallet.balance,
          amount: amount,
          transactionType: TransactionType.TOP_UP,
          transactionId: transactionId,
          sender: agentId,
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

// Withdraw money from a user's wallet
const withdrawFromWallet = async (
  amount: number,
  agentId: string,
  userId: string
) => {
  const transactionId = getTransactionId();

  if (!amount || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Amount must be greater than zero"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userWallet = await Wallet.findOne({ user: userId }).session(session);
    const agentWallet = await Wallet.findOne({ user: agentId }).session(
      session
    );

    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }

    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }

    if (!amount || amount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Amount must be greater than zero"
      );
    }

    if (userWallet.balance < amount || userWallet.balance === 0) {
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

    if (userWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Wallet is blocked, you can not withdraw money!"
      );
    }

    // Check if agent wallet is blocked
    if (agentWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agent wallet is blocked, you can not withdraw money!"
      );
    }

    // Check if the agent and user are the same by comparing IDs
    if (userId === agentId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can not withdraw money to your own wallet!"
      );
    }

    // Update wallet balance
    userWallet.balance -= amount;
    agentWallet.balance += amount;
    await userWallet.save({ session });
    await agentWallet.save({ session });

    // Create a transaction record (optional, if you want to track transactions)
    await Transaction.create(
      [
        {
          wallet: userWallet._id,
          newBalance: userWallet.balance,
          amount: amount,
          transactionType: TransactionType.WITHDRAW,
          transactionId: transactionId,
          sender: userId,
          receiver: agentId, // In case of withdrawal, sender and receiver are the same
          status: TransactionStatus.SUCCESS,
        },
      ],
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { message: "Cash Out successful", balance: userWallet.balance };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to Cash Out or withdraw money!",
      error.message
    );
  }
};

// Send money from one wallet to another
const sendMoney = async (
  senderUserId: string,   // 🔥 senderWalletId থেকে senderUserId করলাম
  recipient: string, // 🔥 email/phone আসবে
  amount: number
) => {
  const transactionId1 = getTransactionId();
  const transactionId2 = getTransactionId();

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
    const senderWallet = await Wallet.findOne({ user: senderUserId }).session(session); // 🔥 userId দিয়ে খুঁজব

    if (!senderWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    }

    // 🔥 Get recipient user by phone/email
    const recipientUser = await User.findOne({
      $or: [{ email: recipient }, { phone: recipient }],
    });

    if (!recipientUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Recipient user not found");
    }

    // 🔥 Get recipient wallet
    const recipientWallet = await Wallet.findOne({ user: recipientUser._id }).session(session);

    if (!recipientWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
    }

    // Check self transfer
    if (senderWallet.user.toString() === recipientUser._id.toString()) {
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

    if (recipientWallet.isBlocked === WalletStatus.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Recipient wallet is blocked, you can not send money!"
      );
    }

    // Transfer
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    // Transaction record
    await Transaction.insertMany(
      [
        {
          wallet: recipientWallet._id,
          newBalance: recipientWallet.balance,
          amount: amount,
          transactionType: TransactionType.TOP_UP,
          transactionId: transactionId1,
          sender: senderUserId,
          receiver: recipientUser._id,
          status: TransactionStatus.SUCCESS,
        },
        {
          wallet: senderWallet._id,
          newBalance: senderWallet.balance,
          amount: amount,
          transactionType: TransactionType.SEND,
          transactionId: transactionId2,
          sender: senderUserId,
          receiver: recipientUser._id,
          status: TransactionStatus.SUCCESS,
        },
      ],
      { session }
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


// Retrieve the authenticated user's wallet
const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId }).populate<{
    user: IUser;
  }>("user");
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

// Get a user's wallet and populate user details
const getUserWallet = async (userId: string) => {
  const wallet = await Wallet.find({ user: userId }).populate<{
    user: IUser;
  }>("user");
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

// Block a user's wallet
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

// Unblock a user's wallet
const unBlockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.isBlocked === WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is already active");
  }

  wallet.isBlocked = WalletStatus.ACTIVE;
  await wallet.save();
};

export const WalletServices = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
  getUserWallet,
  blockWallet,
  unBlockWallet,
};
