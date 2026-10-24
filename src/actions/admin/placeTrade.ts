'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import { TradeSchema } from '../../../schema/TradeSchema';
import { generateTransactionId } from '../../lib/generateTransactionId';
import { sendEmail } from '@/lib/email';
export const placeTrade = async (data: z.infer<typeof TradeSchema>) => {
	const validatedFields = TradeSchema.safeParse(data);
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
	const amount = parseInt(validatedFields.data.amount);

	const trade = await db.transaction.create({
		data: {
			paymentMethod: 'trading',
			transactionId: generateTransactionId(),
			status: 'success',
			transactionType: 'trading',
			postType: validatedFields.data.pair,
			amount: parseInt(validatedFields.data.amount),
			type: validatedFields.data.type,
			userId: user.id,
			date: new Date(),
		},
	});

	if (trade) {
		// Update user balances based on trade type
		const updatedUser = await db.user.update({
			where: { id: user.id },
			data: {
				walletBalance: {
					increment: amount, // Deduct from wallet balance
				},
				profitBalance: {
					increment: amount, // Add to investment balance
				},
			},
		});

		if (updatedUser) {
			await sendEmail(user.email, 'trade', {
				amount: amount,
				symbol: validatedFields.data.pair,
				type: validatedFields.data.type,
			});
			return { success: 'Trade placed successfully' };
		}
	}
	return { error: 'Failed to place trade' };
};
