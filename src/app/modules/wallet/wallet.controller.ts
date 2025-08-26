/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import AppError from "../../errors/AppError";

const topUpWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance, agentId } = req.body;
    const decodedToken = req.user as JwtPayload;

    let finalAgentId = agentId;
    let finalUserId = decodedToken.userId;

    // If Agent is logged in, he is topping up a User
    if (decodedToken.role === Role.AGENT) {
      finalAgentId = decodedToken.userId; // logged in agent
      finalUserId = agentId; // selected user
    }

    // If User is logged in, he requests top up through an Agent
    if (decodedToken.role === Role.USER) {
      finalAgentId = agentId; // selected agent
      finalUserId = decodedToken.userId; // logged in user
    }

    const result = await WalletServices.topUpWallet(
      balance,
      finalAgentId,
      finalUserId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Top Up Money successful!",
      data: result,
    });
  }
);

// const withdrawFromWallet = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const decodedToken = req.user as JwtPayload;
//     const { balance, agentId } = req.body;
//     const result = await WalletServices.withdrawFromWallet(
//       balance,
//       agentId,
//       decodedToken.userId,
//       decodedToken.role
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Withdraw money successfully",
//       data: result,
//     });
//   }
// );

// controllers/wallet.controller.ts


const withdrawFromWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance, agentId } = req.body;
    const decodedToken = req.user as JwtPayload;

    let finalAgentId = agentId;
    let finalUserId = decodedToken.userId;

    // If Agent is logged in, he is withdrawing for a User
    if (decodedToken.role === Role.AGENT) {
      finalAgentId = decodedToken.userId; // logged in agent
      finalUserId = agentId; // selected user
    }

    // If User is logged in, he requests withdrawal through an Agent
    if (decodedToken.role === Role.USER) {
      finalAgentId = agentId; 
      finalUserId = decodedToken.userId; // logged in user
    }

    const result = await WalletServices.withdrawFromWallet(
      balance,
      finalAgentId,
      finalUserId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Withdraw Money successful!",
      data: result,
    });
  }
);

const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { balance, recipient } = req.body;
    const decodedToken = req.user as JwtPayload;
    const result = await WalletServices.sendMoney(
      decodedToken.userId,
      recipient,
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

const getUserWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const result = await WalletServices.getUserWallet(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet retrieved successfully",
      data: result,
    });
  }
);

const blockWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const result = await WalletServices.blockWallet(walletId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet blocked successfully",
      data: result,
    });
  }
);

const unBlockWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const result = await WalletServices.unBlockWallet(walletId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet unblocked successfully",
      data: result,
    });
  }
);

export const WalletControllers = {
  topUpWallet,
  withdrawFromWallet,
  sendMoney,
  getMyWallet,
  getUserWallet,
  blockWallet,
  unBlockWallet,
};
