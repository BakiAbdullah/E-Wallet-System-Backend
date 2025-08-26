import AppError from "../../errors/AppError";
import { IUser, Role, UserStatus } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env.config";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { usersSearchFields } from "./user.constant";

const Initial_Balance = 50;

// Create a new user with a specific role and wallet
const createUser = async (payload: Partial<IUser>, role: Role) => {
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
          role,
        },
      ],
      { session }
    );

    if (role === Role.USER || role === Role.AGENT) {
      await Wallet.create(
        [
          {
            user: user[0]._id,
            balance: Initial_Balance,
            isBlocked: WalletStatus.ACTIVE,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return user[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Register a user with a wallet
const registerUserWithWallet = async (payload: Partial<IUser>) => {
  return await createUser(payload, Role.USER);
};

// Register an agent with a wallet
const registerAgentWithWallet = async (payload: Partial<IUser>) => {
  return await createUser(payload, Role.AGENT);
};

// Retrieve all users with pagination, filtering, and sorting
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(usersSearchFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// Retrieve user
const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return {
    data: user,
  };
};

// Block a user >>>>
const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  user.status = UserStatus.BLOCKED;
  await user.save();
  return user;
};
// Un Block a user >>>>
const unblockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  user.status = UserStatus.ACTIVE;
  await user.save();
  return user;
};

// Approve an agent
const toggleAgentApproval = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  agent.isApproved = !agent.isApproved; // ✅ auto toggle
  await agent.save();

  return agent;
};

// Verify an agent
const verifyAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  agent.isVerified = !agent.isVerified;
  await agent.save();
  return agent;
};

export const UserServices = {
  registerUserWithWallet,
  registerAgentWithWallet,
  getAllUsers,
  getUserProfile,
  blockUser,
  toggleAgentApproval,
  unblockUser,
  verifyAgent,
};
