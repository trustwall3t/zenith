'use server'
import { z } from "zod";
import { withdrawSchema } from "../../schema/withdrawSchema";
import { db } from "@/lib/db";
import { generateTransactionId } from "@/lib/generateTransactionId";
import { sendEmail } from "@/lib/email";
export const requestWithdrawal = async (data : z.infer<typeof withdrawSchema>) => {
    const validatedFields = withdrawSchema.safeParse(data);
    if(!validatedFields.success) {
        return {error: 'Invalid fields'}
    }
    const {wallet, amount, paymentMethod} = validatedFields.data;
        const user = await db.user.findUnique({
        where: {
            id: data.id
        }
    })
    if(!user) {
        return {error: 'User not found'}
    }
    if(user.walletBalance! < Number(amount)) {
        return {error: 'Insufficient balance'}
    }
      if (user.isVerified === false) {
			return { error: 'KYC not verified' };
		}
    const withdrawal = await db.transaction.create({
        data: {
            userId: user.id,
            amount: Number(amount),
            type: 'withdrawal',
            status: 'pending',
            paymentMethod,
            transactionType: 'withdrawal',
            postType: wallet,
            transactionId: generateTransactionId(),
            createdAt: new Date(),
        }
    })
    await sendEmail(user.email, 'withdraw', {
        amount: Number(amount),
    })
    await sendEmail('finitedome@yahoo.com', 'AdminNotification', {
        amount: Number(amount),
        type: 'withdraw',
    });
    if(!withdrawal) {
        return {error: 'Withdrawal request failed'}
    }
    return {success: 'Withdrawal request sent, please wait for approval'}
}