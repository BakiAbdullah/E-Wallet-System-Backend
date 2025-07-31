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
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, 
    commissionRate: { type: Number, default: 0, min: 0, max: 100 },
    nid: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🧠 Middleware: Only agents can have commissionRate and isApproved
userSchema.pre("save", function (next) {
  if (this.role === Role.AGENT) {
    if (!this.nid) {
      return next(new Error("NID is required for agents"));
    }
  } else {
    // Non-agents: clean up agent-only fields
    this.isApproved = undefined;
    this.commissionRate = undefined;
  }

  next();
});

export const User = model<IUser>("User", userSchema);
