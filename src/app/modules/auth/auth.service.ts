/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { createAccessTokenWithRefreshToken } from "../../utils/getUserTokens";
import AppError from "../../errors/AppError";
import { UserStatus } from "../user/user.interface";
import { envVars } from "../../config/env.config";


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const forgotPassword = async (email: string) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User does not exist with this email!"
    );
  }

  if (
    existingUser.status === UserStatus.BLOCKED ||
    existingUser.status === UserStatus.INACTIVE
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked or inactive!");
  }

  if (existingUser.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
  }

  const jwtPayload = {
    userId: existingUser._id,
    email: existingUser.email,
    role: existingUser.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_SECRET as string, {
    expiresIn: "10m",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetLink = `${envVars.FRONTEND_URL}/reset-password?id=${existingUser._id}&token=${resetToken}`;

  // Here we would send the reset link to the user's email by using a mail service (nodemailer)

  // sendEmail({
  //   to: existingUser.email,
  //   subject: "Password Reset Link",
  //   templateName: "forgetPassword",
  //   templateData: {
  //     name: existingUser.name,
  //     resetUrlLink: resetLink,
  //   },
  // });

  /**
   * http://localhost:5173/reset-password?id=6883508f679bde07e02e7705&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgzNTA4ZjY3OWJkZTA3ZTAyZTc3MDUiLCJlbWFpbCI6ImJha2lhYmR1bGxhaDk2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzNDM2NjQ3LCJleHAiOjE3NTM0MzcyNDd9.GClVzE8CINkj08gx1vGCZ-nuUlIt12W8hYPMGiJNZ0g
   */
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const existingUser = await User.findById(decodedToken.userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  existingUser.password = hashedPassword;

  await existingUser.save();
};

// const setPassword = async (userId: string, plainPassword: string) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found!");
//   }

//   // If the user has a password, we will not allow them to set a new password
//   if (
//     user.password &&
//     user.auths.some((providerObject) => providerObject.provider === "google")
//   ) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "You have already set your password. Now you can change the password from your profile settings."
//     );
//   }

//   const hashedPassword = await bcryptjs.hash(
//     plainPassword,
//     Number(envVars.BCRYPT_SALT_ROUNDS)
//   );

//   // If the user has no password, we will add the credentials provider
//   // Otherwise, we will just update the password
//   const auths: IAuthProvider[] = [
//     ...user.auths,
//     { provider: "credentials", providerId: user.email },
//   ];

//   // If the user has a password, we will update it
//   user.auths = auths;
//   user.password = hashedPassword;

//   // Remove the password from the user object before saving
//   await user.save();
// };

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match!");
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  await user.save();
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  // setPassword,
  forgotPassword,
  changePassword,
};
