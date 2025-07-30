import z from "zod";

export const topUpZodValidator = z.object({
  balance: z
    .number()
    .min(1, { message: "Minimum balance is required" })
  .max(10000, { message: "Maximum balance is 10000" }),
});