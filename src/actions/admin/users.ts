import { db } from '@/lib/db';
import type { User } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

export const getAllUsers = async () => {
	noStore();
	try {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				country: true,
				walletBalance: true,
				refcode: true,
				isVerified: true,
				isDisabled: true,
				tradeMode: true,
				createdAt: true,
				profitBalance: true,
				investmentBalance: true,
			},
			orderBy: { createdAt: "desc" },
		});

		const kycRows = await db.kyc.findMany({
			where: { userId: { in: users.map((u) => u.id) } },
			select: { userId: true, status: true, createdAt: true },
			orderBy: { createdAt: "desc" },
		});

		const kycByUser = new Map<string, string>();
		for (const row of kycRows) {
			if (!kycByUser.has(row.userId)) {
				kycByUser.set(row.userId, row.status);
			}
		}

		return users.map((user) => ({
			...user,
			kycStatus: kycByUser.get(user.id) ?? null,
		}));
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
};

export const getUserById = async (id: string): Promise<User | null> => {
	const user = await db.user.findUnique({ where: { id } });
	console.log(user);
	return user;
};

/** @deprecated Use deleteUserById from manageUser in UI */
export const deleteUser = async (id: string) => {
	await db.session.deleteMany({ where: { userId: id } });
	const user = await db.user.delete({ where: { id } });
	revalidatePath("/admin/dashboard/users");
	return user;
};
