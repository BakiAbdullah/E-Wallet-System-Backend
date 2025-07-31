/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";

const topUpWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance } = req.body;
    const decodedToken = req.user as JwtPayload;

    const result = await WalletServices.topUpWallet(
      balance,
      decodedToken.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Add Money successfull!",
      data: result,
    });
  }
);

const withdrawFromWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance } = req.body;
    const decodedToken = req.user as JwtPayload;
    const result = await WalletServices.withdrawFromWallet(
      balance,
      decodedToken.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdraw money successfully",
      data: result,
    });
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance, recepientWalletID } = req.body;
    const decodedToken = req.user as JwtPayload;
    const result = await WalletServices.sendMoney(
      decodedToken.userId,
      recepientWalletID,
      balance
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  }
);

const getMyWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await WalletServices.getMyWallet(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet retrieved successfully",
      data: result,
    });
  }
);

export const WalletControllers = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
};
