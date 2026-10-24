import { z } from "zod";

export const depositSchema = z.object({
    amount: z.string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)), {
            message: "Amount must be a valid number"
        })
        .refine((val) => Number(val) > 0, {
            message: "Amount must be greater than 0"
        }),
    method: z.string().min(1, "Payment method is required"),
});