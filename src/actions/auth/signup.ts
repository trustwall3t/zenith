'use server';

import {
	UserRegisterSchema,
	verifyEmailSchem,
} from '../../../schema/UserSchema';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import type { Prisma } from '@/generated/prisma';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { generateReferralCode } from '@/lib/utils';
import { redirect } from 'next/navigation';
export const signup = async (formData: z.infer<typeof UserRegisterSchema>) => {
	const validatedFields = UserRegisterSchema.safeParse({
		email: formData.email,
		password: formData.password,
		fullName: formData.fullName,
		phoneNumber: formData.phoneNumber,
		address: formData.address,
		country: formData.country,
		accountType: formData.accountType,
		yearlyIncomeRange: formData.yearlyIncomeRange,
		agreement: formData.agreement,
		confirmPassword: formData.confirmPassword,
	});
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const {
		email,
		password,
		fullName,
		phoneNumber,
		address,
		country,
		accountType,
		yearlyIncomeRange,
	} = validatedFields.data;

	try {
		const existingUser = await db.user.findUnique({
			where: { email },
		});

		if (existingUser && existingUser.confirm === 'true') {
			return { error: 'Email already registered' };
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000,
		).toString();

		let user;
		if (existingUser && existingUser.confirm !== 'true') {
			user = await db.user.update({
				where: { email },
				data: {
					password: hashedPassword,
					name: fullName,
					phone: phoneNumber,
					address,
					country,
					AccountType: accountType,
					yearlyIncomeRange,
					token: verificationToken,
				} as Prisma.UserUpdateInput,
			});
		} else {
			user = await db.user.create({
				data: {
					email,
					password: hashedPassword,
					name: fullName,
					phone: phoneNumber,
					refcode: generateReferralCode(),
					walletBalance: 0,
					address,
					country,
					AccountType: accountType,
					yearlyIncomeRange,
					token: verificationToken,
				} as Prisma.UserCreateInput,
			});
		}

		if (!user) {
			return { error: 'User creation failed' };
		}

		await sendEmail(email, 'welcome', {
			name: fullName,
			token: user.token as string,
			email: email,
		});
	} catch (error: unknown) {
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'P2002'
		) {
			return { error: 'Email already registered' };
		}
		console.error('Signup error:', error);
		return { error: 'An error occurred during signup. Please try again.' };
	}

	redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
};

export const verifyEmail = async (
	formData: z.infer<typeof verifyEmailSchem>,
) => {
	const validatedFields = verifyEmailSchem.safeParse({
		token: formData.token,
		email: formData.email,
	});
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const { token, email } = validatedFields.data;

	const user = await db.user.findUnique({
		where: { email },
	});
	if (!user) {
		return { error: 'User not found' };
	}

	const isTokenValid = token === user.token;
	if (!isTokenValid) {
		return { error: 'Invalid verification token' };
	}

	// Update user verification status
	await db.user.update({
		where: { email },
		data: {
			confirm: 'true',
			token: null, // Clear the token after successful verification
		},
	});

	return { success: 'Email verified successfully' };
};
