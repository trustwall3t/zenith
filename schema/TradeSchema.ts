import { z } from "zod";

export const TradeSchema = z.object({
    pair: z.string(),
    type: z.string(),
    amount: z.string(),
    userId: z.string(),
});