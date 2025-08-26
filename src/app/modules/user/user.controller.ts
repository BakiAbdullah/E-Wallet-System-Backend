/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

// Register a user with a wallet
const registerUserWithWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.registerUserWithWallet(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

// Register an agent with a wallet
const registerAgentWithWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agent = await UserServices.registerAgentWithWallet(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Agent created successfully",
      data: agent,
    });
  }
);

// Retrieve all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(
      query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All users retrieved successfully",
      data: result
    });
  }
);
// Retrieve User Profile
const getUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getUserProfile(
      decodedToken.userId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result.data
    });
  }
);

// Approve an agent to perform actions
const approveAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.params.id;
    const result = await UserServices.approveAgent(agentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent approved successfully!",
      data: result,
    });
  }
);

// Reject an agent
const rejectAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.params.id;
    const result = await UserServices.rejectAgent(agentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent Rejected!",
      data: result,
    });
  }
);

export const UserControllers = {
  registerUserWithWallet,
  registerAgentWithWallet,
  getAllUsers,
  getUserProfile,
  approveAgent,
  rejectAgent,
};