/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    // const result = await UserServices.getAllUsers(
    //   query as Record<string, string>
    // );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All users retrieved successfully",
    //   data: result.data,
    //   meta: result.meta,
    });
  }
);

export const UserControllers = { 
  createUser,
  getAllUsers,
};