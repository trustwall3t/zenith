import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';
import { unstable_noStore as noStore } from 'next/cache';

export const getAllWithdrawalRequest = async () => {
	noStore();
	const withdrawalRequest = await db.transaction.findMany({
		where: {
			transactionType: 'withdrawal',
		},
		include: {
			user: {
				select: {
					name: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	return withdrawalRequest;
};

export const approveWithdrawalRequest = async (id: string) => {
	const withdrawalRequest = await db.transaction.update({
		where: { id },
		data: { status: 'success' },
	});
	const user = await db.user.findUnique({
		where: { id: withdrawalRequest.userId },
	});
	if (!user) return;
	await db.user.update({
		where: { id: withdrawalRequest.userId },
		data: {
			walletBalance:
				user.walletBalance! - Number(withdrawalRequest.amount),
		},
	});
	await sendEmail(user.email, 'confirmWithdraw', {
		amount: Number(withdrawalRequest.amount),
	});
	revalidatePath('/admin/dashboard/withdrawal');
};

export const rejectWithdrawalRequest = async (id: string) => {
	const withdrawalRequest = await db.transaction.update({
		where: { id },
		data: { status: 'cancelled' },
	});
	revalidatePath('/admin/dashboard/withdrawal');
	return withdrawalRequest;
};

export const deleteWithdrawalRequest = async (id: string) => {
	await db.transaction.delete({
		where: { id },
	});
	revalidatePath('/admin/dashboard/withdrawal');
	return {
		success: 'Withdrawal request deleted successfully',
	};
};