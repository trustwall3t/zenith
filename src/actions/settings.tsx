'use server';
import { db } from '@/lib/db';
import { PersonalInfoSchema } from '../../schema/personalInfoSchema';
import { z } from 'zod';
import { PasswordSchema } from '../../schema/passwordSchema';
import bcrypt from 'bcrypt';
import { WalletSchema } from '../../schema/walletSchema';
export const personalInfoSettings = async (
	data: z.infer<typeof PersonalInfoSchema>
) => {
	const validatedFields = PersonalInfoSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const user = await db.user.findUnique({
		where: {
			email: data.email,
		},
	});
	if (!user) {
		return { error: 'User not found' };
	}
	const updatedUser = await db.user.update({
		where: { email: data.email },
		data: {
			name: validatedFields.data.name,
			phone: validatedFields.data.phone,
			address: validatedFields.data.address,
			AccountType: validatedFields.data.accountType,
			country: validatedFields.data.country,
		},
	});
	if (!updatedUser) {
		return { error: 'Failed to update user' };
	}
	return { success: 'User updated successfully' };
};

export const updatePassword = async (data: z.infer<typeof PasswordSchema>) => {
	const validatedFields = PasswordSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const user = await db.user.findUnique({
		where: {
			id: data.id,
		},
	});
	if (!user) {
		return { error: 'User not found' };
	}
	const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);
	const updatedUser = await db.user.update({
		where: { id: user.id },
		data: {
			password: hashedPassword,
		},
	});
	if (!updatedUser) {
		return { error: 'Failed to update password' };
	}
	return { success: 'Password updated successfully' };
};

export const setUpWallet = async (data: z.infer<typeof WalletSchema>) => {
	const validatedFields = WalletSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	    }
	const user = await db.user.findUnique({
		where: {
			id: data.id,
		},
	});
	if (!user) {
		return { error: 'User not found' };
	}
	const updatedUser = await db.user.update({
		where: { id: user.id },
		data: {
			btcAddress: validatedFields.data.BtcAddress,
			ethAddress: validatedFields.data.EthAddress,
			usdtAddress: validatedFields.data.UsdtAddress,
		},
	});
	if (!updatedUser) {
		return { error: 'Failed to update wallet' };
	}
	return { success: 'Wallet updated successfully' };
};
