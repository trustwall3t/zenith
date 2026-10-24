import { z } from "zod";

export const PersonalInfoSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    accountType: z.string().optional(),
    country: z.string().optional(),
});