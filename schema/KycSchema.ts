import { z } from 'zod';

export const KycSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	phone: z.string().min(1),
	address: z.string().min(1),
	country: z.string().min(1),
	idNumber: z.string().min(1),
	idType: z.string().min(1),
	idImage: z.string().min(1),
});
