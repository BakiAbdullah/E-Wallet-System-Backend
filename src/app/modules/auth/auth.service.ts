import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { envVars } from "../../config/env.config";
import { User } from "../user/user.model";


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
  changePassword,
};
