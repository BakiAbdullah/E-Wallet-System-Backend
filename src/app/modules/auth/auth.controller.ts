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

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    //* const refreshToken = req.headers.authorization; // for testing purpose
    if (!refreshToken) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing!")
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookieUtil(res, tokenInfo.accessToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token retrieved successfully!",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully!",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully!",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset link sent successfully!",
      data: null,
    });
  }
);

// const setPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { password } = req.body;
//     const decodedToken = req.user as JwtPayload;

//     await AuthServices.setPassword(decodedToken.userId, password);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Password changed successfully!",
//       data: null,
//     });
//   }
// );

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

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


export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  resetPassword,
  // setPassword,
  forgotPassword
};
