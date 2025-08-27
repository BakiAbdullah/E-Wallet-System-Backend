/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import AppError from "../../errors/AppError";
import { createUserTokens } from "../../utils/getUserTokens";
import { setAuthCookieUtil } from "../../utils/setCookies";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
    
      if (err) {
        return next(new AppError(err.statusCode || 401, err.message));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = createUserTokens(user);
      // Remove password from user object
      const { password: pass, ...userWithoutPassword } = user.toObject();

      // Set access and refresh tokens in cookies
      setAuthCookieUtil(res, userTokens);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged in successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: userWithoutPassword, //* This will be the user object returned by the local strategy
        },
      });
    })(req, res, next);
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      // secure: false,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      // secure: false,
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully!",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully!",
      data: null,
    });
  }
);

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.updateProfile(
      name,
      phone,
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully!",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  logout,
  changePassword,
  updateProfile,
};
