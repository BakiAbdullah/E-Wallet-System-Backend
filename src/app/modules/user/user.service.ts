import AppError from "../../errors/AppError";
import { IUser } from "./user.interface"
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env.config";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    
    const existingUser = await User.findOne({email});

    if (existingUser) {
         throw new AppError(
           httpStatus.BAD_REQUEST,
           "User already exists with this email"
         );
    }

    const encryptedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    const user = await User.create({
      ...rest,
      email,
      password: encryptedPassword,
    });

    return user;
}

export const UserServices = { 
    createUser,
}