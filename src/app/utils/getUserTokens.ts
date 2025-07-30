import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env.config";
import { IUser, UserStatus } from "../modules/user/user.interface";
import { generateJwtToken, verifyJwtToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errors/AppError";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT Access Token
  const accessToken = generateJwtToken(
    jwtPayload,
    envVars.JWT_SECRET as string,
    envVars.JWT_EXPIRES_IN as string
  );

  // Generate JWT Refresh Token
  const refreshToken = generateJwtToken(
    jwtPayload,
    envVars.JWT_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES_IN as string
  );

  return { accessToken, refreshToken };
};

export const createAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyJwtToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  // Finding user by email from the verified token
  const existingUser = await User.findOne({
    email: verifiedRefreshToken.email,
  });
    
    // check if user exists
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

     if (
       existingUser.status === UserStatus.BLOCKED ||
       existingUser.status === UserStatus.INACTIVE
     ) {
       throw new AppError(
         httpStatus.BAD_REQUEST,
         "User is blocked or inactive!"
       );
    }
    
    if (existingUser.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
    }

    // JWT Payload for access token
    const jwtPayload = {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
    }

    // Generate new access token
    const accessToken = generateJwtToken(
      jwtPayload,
      envVars.JWT_SECRET as string,
      envVars.JWT_EXPIRES_IN as string
    );

    return { accessToken };
};
