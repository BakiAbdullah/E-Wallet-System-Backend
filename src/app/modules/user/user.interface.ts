/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: Role;
  status: UserStatus;
  address?: string;
  avatar?: string;
  // Agent-specific fields (conditionally required)
  isApproved?: boolean;
  commissionRate?: number;
  nid?: string; // Optional for USER, Required for AGENT
}
