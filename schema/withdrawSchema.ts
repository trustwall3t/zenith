import { z } from "zod";

export const withdrawSchema = z.object({
    id: z.string(),
    wallet: z.string(),
    paymentMethod: z.string(),
    amount: z.string(),
});
