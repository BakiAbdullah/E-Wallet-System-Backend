import { model, Schema } from "mongoose";
import { IUser, Role, UserStatus } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    avatar: { type: String, default: "" },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    commissionRate: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// If the role is AGENT, commissionRate must be defined
userSchema.pre("save", function (next) {
  if (!this.role) this.role = Role.USER;

  if (this.role === Role.AGENT) {
    if (this.commissionRate === undefined) {
      return next(new Error("Agent must have a commission rate"));
    }
  } else {
    this.commissionRate = undefined;
    this.isApproved = undefined;
    this.isVerified = undefined;
  }

  next();
});

export const User = model<IUser>("User", userSchema);
