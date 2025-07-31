/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";

const getAllTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.getAllTransactionHistory();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction history retrieved successfully",
      data: result,
    });
  }
);
const getUserTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await TransactionService.getUserTransactionHistory(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction history retrieved successfully",
      data: result,
    });
  }
);

export const TransactionControllers = {
  getAllTransactionHistory,
  getUserTransactionHistory,
};
