/* eslint-disable no-unused-vars */
import { z } from "zod";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export const createUserZodValidator = z
  .object({
    name: z
      .string({ invalid_type_error: "Name must be a string" })
      .min(1, { message: "Name is required" })
      .max(50, { message: "Name can not exceed 50 characters!" }),

    email: z
      .string({ invalid_type_error: "Email must be a string" })
      .email({ message: "Invalid email format!" }),

    password: z
      .string({ invalid_type_error: "Password must be a string!" })
      .min(8, { message: "Password must be at least 8 characters long!" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one digit, and one special character!",
        }
      ),

    phone: z
      .string({ invalid_type_error: "Phone must be a string!" })
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Invalid phone number format! Number is for Bangladesh only.",
      }),

    address: z
      .string({ invalid_type_error: "Address must be a string!" })
      .max(200, {
        message: "Address can not exceed 200 characters!",
      }),

    role: z.nativeEnum(Role).default(Role.USER),

    commissionRate: z.number().optional(),
    isApproved: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === Role.AGENT) {
      if (data.commissionRate === undefined) {
        ctx.addIssue({
          path: ["commissionRate"],
          code: z.ZodIssueCode.custom,
          message: "commissionRate is required for agents",
        });
      }

      if (data.isApproved === undefined) {
        ctx.addIssue({
          path: ["isApproved"],
          code: z.ZodIssueCode.custom,
          message: "isApproved is required for agents",
        });
      }
    }
  });
