import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
);

export type CreateSessionOptions = {
	impersonatedByAdminId?: string;
};

export async function createSession(
	userId: string,
	options?: CreateSessionOptions,
) {
	const payload: { userId: string; impersonatedByAdminId?: string } = {
		userId,
	};
	if (options?.impersonatedByAdminId) {
		payload.impersonatedByAdminId = options.impersonatedByAdminId;
	}

	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('24h')
		.sign(JWT_SECRET);

	// Store session in database
	await db.session.create({
		data: {
			user: {
				connect: {
					id: userId,
				},
			},
			token,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
		},
	});

	// Set cookie
	const cookieStore = await cookies();
	cookieStore.set('session', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 24 * 60 * 60, // 24 hours
	});

	return token;
}

export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session')?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		const session = await db.session.findFirst({
			where: {
				token,
				expiresAt: {
					gt: new Date(),
				},
			},
			include: {
				user: {
					include: {
						kyc: {
							select: {
								status: true,
							},
							orderBy: { createdAt: 'desc' },
						},
					},
				},
			},
		});

		if (!session) return null;

		const impersonatedByAdminId =
			typeof payload.impersonatedByAdminId === 'string'
				? payload.impersonatedByAdminId
				: undefined;

		return { ...session, impersonatedByAdminId };
	} catch (error) {
		console.log(error)
		return null;
	}
}

export async function deleteSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session')?.value;
	if (token) {
		await db.session.deleteMany({
			where: { token },
		});
	}
	cookieStore.delete('session');
}
