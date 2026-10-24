'use server';
import { db } from '@/lib/db';
import { BalanceSchema } from '../../../schema/balanceSchema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateTransactionId } from '../../lib/generateTransactionId';
export const updateUserBalance = async (
	data: z.infer<typeof BalanceSchema>
) => {
	const validatedFields = BalanceSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const user = await db.user.findUnique({
		where: {
			id: validatedFields.data.userId,
		},
	});
	if (!user) {
		return { error: 'User not found' };
	}
	const balance = validatedFields.data.balance
		? parseInt(validatedFields.data.balance)
		: 0;
	const profit = validatedFields.data.profit
		? parseInt(validatedFields.data.profit)
		: 0;
	const investment = validatedFields.data.investment
		? parseInt(validatedFields.data.investment)
		: 0;
	const credit = validatedFields.data.credit;
	const updatedUser = await db.user.update({
		where: { id: user.id },
		data: {
			walletBalance: credit
				? (user.walletBalance ?? 0) +
				  balance  +
				  profit  +
				  investment 
				: (user.walletBalance ?? 0) -
				  balance -
				  profit -
				  investment,
			profitBalance: credit
				? (user.profitBalance ?? 0) + profit
				: (user.profitBalance ?? 0) - profit,
			investmentBalance: credit
				? (user.investmentBalance ?? 0) + investment
				: (user.investmentBalance ?? 0) - investment,
		},
	});
	if (updatedUser) {
		await db.transaction.create({
			data: {
				userId: user.id,
				amount:
					investment > 0
						? investment
						: profit > 0
						? profit
						: balance > 0
						? balance
						: 0,
				type:
					investment > 0
						? 'Deposit'
						: profit > 0
						? 'Profit'
						: balance > 0
						? 'Balance'
						: 'Target',
				status: 'success',
				paymentMethod:
					investment > 0
						? 'deposit'
						: profit > 0
						? 'Profit'
						: balance > 0
						? 'Balance'
						: 'Target',
				transactionType:
					investment > 0
						? 'deposit'
						: profit > 0
						? 'Profit'
						: balance > 0
						? 'Balance'
						: 'Target',
				postType: 'live trade',
				transactionId: generateTransactionId(),
				createdAt: new Date(),
				date: new Date(),
			},
		});
		revalidatePath("/admin/dashboard/livetrade");
		revalidatePath("/admin/dashboard/users");
		return { success: 'Balance updated successfully' };
	}
	return { error: 'Failed to update balance' };
};
