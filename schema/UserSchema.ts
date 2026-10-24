import { z } from 'zod';

export const UserLoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(1, { message: 'Password is required' }),
});

export const UserRegisterSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().min(1, { message: 'Password is required' }),
		confirmPassword: z
			.string()
			.min(1, { message: 'Confirm password is required' }),
		fullName: z.string().min(1, { message: 'Full Name is required' }),
		phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
		address: z.string().min(1, { message: 'Address is required' }),
		country: z.string().min(1, { message: 'Country is required' }),
		refby: z.string().optional(),
		accountType: z.string().min(1, { message: 'Account type is required' }),
		yearlyIncomeRange: z.string().min(1, { message: 'Yearly income range is required' }),
		agreement: z.boolean().refine((data) => data, {
			message: 'You must agree to the terms and conditions',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export const ResetPasswordSchema = z.object({
	id: z.string(),
	password: z.string().min(1, { message: 'Password is required' }),
	confirmPassword: z
		.string()
		.min(1, { message: 'Confirm password is required' }),
});

export const verifyEmailSchem = z.object({
	token: z.string().min(1,{
		message:'token required'
	}),
	email: z.string()
})