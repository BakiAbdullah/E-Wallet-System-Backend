import z from "zod";

export const topUpZodValidator = z.object({
  balance: z
    .number()
    .positive({ message: "Balance must be a positive number" })
    .min(1, { message: "Minimum balance is required" })
    .max(10000, { message: "Maximum balance is 10000" }),
  agentId: z.string().min(1, { message: "Agent ID is required" }),
});