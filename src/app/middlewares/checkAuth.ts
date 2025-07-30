import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";
import { UserStatus } from "../modules/user/user.interface";
import AppError from "../errors/AppError";
import { envVars } from "../config/env.config";
import { verifyJwtToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Access token is required");
      }
      const verifiedToken = await verifyJwtToken(
        accessToken,
        envVars.JWT_SECRET as string
      );

      if (!verifiedToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }

      // Check if user exists or its status is Deleted, Blocked or Inactive
      const existingUser = await User.findOne({ email: verifiedToken.email });

      if (!existingUser) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User does not exist with this email!"
        );
      }

      // if (existingUser.isApproved === false) {
      //   throw new AppError(httpStatus.BAD_REQUEST, "User is not approved!");
      // }

      if (
        existingUser.status === UserStatus.BLOCKED ||
        existingUser.status === UserStatus.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User is blocked or inactive!"
        );
      }
      // if (existingUser.isDeleted) {
      //   throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
      // }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }

      // Attaching user information to the request object **********
      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
