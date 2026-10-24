'use server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AdminLoginSchema } from '../../../schema/AdminLoginSschema';
import { createAdminSession, deleteAdminSession } from '@/lib/admin-auth';
import { verifyPassword } from '@/lib/auth/password';

export const signupAdmin = async ({
	email,
	password,
	name,
}: {
	email: string;
	password: string;
	name: string;
}) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const admin = await db.admin.create({
		data: {
			email: email as string,
			password: hashedPassword as string,
			name: name as string,
		},
	});
	if (!admin) {
		return { error: 'Failed to create admin' };
	}
	return { success: 'Admin created successfully' };
};

export const loginAdmin = async (
	
	formData: z.infer<typeof AdminLoginSchema>
) => {
		
	try {
		const validatedFields = AdminLoginSchema.safeParse({
			email: formData.email,
			password: formData.password,
		});

		if (!validatedFields.success) {
			return { error: 'Invalid fields' };
		}

		const email = validatedFields.data.email.trim().toLowerCase();
		const { password } = validatedFields.data;
		const admin = await db.admin.findUnique({ where: { email } });

		if (!admin) {
			return { error: 'Admin not found' };
		}

		const isPasswordValid = await verifyPassword(password, admin.password);
		if (!isPasswordValid) {
			return { error: 'Invalid credentials' };
		}

		// Create admin session with JWT
		await createAdminSession(admin.id, admin.email);

		// Return the redirect URL instead of calling redirect directly
		return { redirect: '/admin/dashboard' };
	} catch (error) {
		console.error('Admin login error:', error);
		return { error: 'An error occurred during login' };
	}

};

export const logoutAdmin = async () => {
	await deleteAdminSession();
};
