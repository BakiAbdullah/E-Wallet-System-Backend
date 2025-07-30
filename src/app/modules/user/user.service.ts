import AppError from "../../errors/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env.config";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";

const Initial_Balance = 50;

const registerUserWithWallet = async (payload: Partial<IUser>) => {
    const session = await User.startSession();
    session.startTransaction();

  try {
    const { email, password, ...rest } = payload;

    const existingUser = await User.findOne({ email }).session(session);

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

    const user = await User.create(
      [
        {
          ...rest,
          email,
          password: encryptedPassword,
        },
      ],
      { session }
    );

    // Create wallet for the user
    if (user[0].role === Role.USER || user[0].role === Role.AGENT) {
      await Wallet.create(
        [
          {
            user: user[0]._id,
            balance: Initial_Balance,
            isBlocked: WalletStatus.ACTIVE, // Default status
          },
        ],
        { session }
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return user[0];
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUsers = async () => { 
  const users = await User.find({}).select("-password");
  return users;
};

export const UserServices = {
  registerUserWithWallet,
  getAllUsers,
};
