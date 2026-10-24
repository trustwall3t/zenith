import { z } from "zod";

export const BalanceSchema = z.object({

	balance: z.string().optional(),
	profit: z.string().optional(),
	investment: z.string().optional(),
	credit: z.boolean(),
	userId: z.string(),
});
