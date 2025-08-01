/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TransactionService } from "./transaction.service";
import { JwtPayload } from "jsonwebtoken";

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

const getMyTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload

    const result = await TransactionService.getMyTransactionHistory(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your transaction history retrieved successfully",
      data: result,
    });
  }
);

export const TransactionControllers = {
  getAllTransactionHistory,
  getUserTransactionHistory,
  getMyTransactionHistory,
};
