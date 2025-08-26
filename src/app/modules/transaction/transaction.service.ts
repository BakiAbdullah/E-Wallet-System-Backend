import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import { Transaction } from "./transaction.model";
import { transactionsSearchFields } from "./transaction.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

// Admin all transaction history retrieval
const getAllTransactionHistory = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find()
      .populate("sender", "name email role -_id")
      .populate("receiver", "name email role -_id")
      .populate("wallet", "balance -_id"),
    query
  );
  const transactionsData = queryBuilder
    .filter()
    .search(transactionsSearchFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactionsData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// Specific users all transaction history retrieval by walletID
const getUserTransactionHistory = async (walletId: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({wallet: walletId})
      .populate("receiver", "name email role -_id")
      .populate("sender", "name email role -_id")
      .populate("wallet", "balance isBlocked user _id"),
    query
  );
  const usersTransactionsData = queryBuilder
    .filter()
    .search(transactionsSearchFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersTransactionsData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// Authenticated users Own transaction history retrieval
const getMyTransactionHistory = async (userId: string) => {
  const result = await Transaction.find({ receiver: userId })
    .populate("receiver", "name email role -_id")
    .populate("sender", "name email role -_id")
    .populate("wallet", "balance _id");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction history not found");
  }
  return result;
};

export const TransactionService = {
  getAllTransactionHistory,
  getUserTransactionHistory,
  getMyTransactionHistory,
};
