import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import { Transaction } from "./transaction.model";

const getAllTransactionHistory = async () => {
  const result = await Transaction.find()
    .populate("sender", "name email role -_id")
    .populate("receiver", "name email role -_id")
    .populate("wallet", "balance -_id");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction history not found");
  }
  return result;
};

// This function retrieves the transaction history for a specific user by their receiver ID.
const getUserTransactionHistory = async (receiverId: string) => {
  const result = await Transaction.findOne({ receiver: receiverId })
    .populate("receiver", "name email role -_id")
    .populate("sender", "name email role -_id")
    .populate("wallet", "balance -_id");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction history not found");
  }
  return result;
};

export const TransactionService = {
  getAllTransactionHistory,
  getUserTransactionHistory,
};
