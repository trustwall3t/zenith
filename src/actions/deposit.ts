'use server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { generateTransactionId } from '@/lib/generateTransactionId';
import { sendEmail } from '@/lib/email';

export const deposit = async (formData: FormData) => {
	const amount = formData.get('amount');
	const method = formData.get('method');
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	const user = await db.user.findUnique({
		where: {
			id: session.userId,
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	const transaction = await db.transaction.create({
		data: {
			amount: Number(amount),
			userId: user.id,
			transactionType: 'deposit',
			paymentMethod: method as string,
			transactionId: generateTransactionId(),
			status: 'pending',
			postType: 'deposit',
			type: 'investment',
		},
	});
	await addReferralBonus(user.refby as string, Number(amount));
	if (!transaction) {
		return {
			error: 'Failed to create transaction',
		};
	}
	await sendEmail(user.email, 'deposit', {
		amount: Number(amount),
	});
	await sendEmail('finitedome@yahoo.com', 'AdminNotification', {
		amount: Number(amount),
		type: 'deposit',
	});
	return {
		success:
			'Deposit request created successfully, please wait for confirmation',
	};
};

export const addReferralBonus = async (referral: string, amount: number) => {
	if (!referral) {
		return false;
	}
	const user = await db.user.findFirst({
		where: {
			refcode: referral,
		},
	});
	if (!user) {
		return false;
	}
	await db.user.update({
		where: { id: user.id },
		data: { refbonus: (user.refbonus || 0) + amount * 0.1,
			walletBalance: (user.walletBalance || 0) + amount * 0.1,

		 },
	});
	await sendEmail(user.email, 'deposit', {
		amount: amount * 0.1,
	});
	return true;
};
