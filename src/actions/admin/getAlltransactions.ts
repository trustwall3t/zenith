import { db } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export const getAllTransactions = async () => {
	noStore();

	const transactions = await db.transaction.findMany({
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	return transactions;
};
