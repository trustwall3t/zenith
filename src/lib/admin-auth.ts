import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
);

interface AdminJwtPayload {
	adminId: string;
	email: string;
	role: 'admin';
	iat: number;
	exp: number;
}

export async function createAdminSession(adminId: string, email: string) {
	console.log('Creating admin session for:', { adminId, email });

	const token = await new SignJWT({ adminId, email, role: 'admin' })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('12h')
		.sign(JWT_SECRET);

	console.log('JWT token created successfully');

	// Set secure cookie with additional security flags
	const cookieStore = await cookies();
	cookieStore.set('admin_session', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 12 * 60 * 60, // 12 hours
		// Must include /api/admin/* routes used by the admin dashboard (emit, etc.)
		path: '/',
	});
	console.log('Admin session cookie set');

	return token;
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get('admin_session')?.value;

	if (!sessionToken) {
		console.log('No admin session token found in cookies');
		return null;
	}

	try {
		console.log('Verifying admin session token');
		const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
		console.log('JWT token verified successfully');
		return payload as unknown as AdminJwtPayload;
	} catch (error) {
		console.error('Error validating admin session:', error);
		return null;
	}
}

export async function deleteAdminSession() {
	const cookieStore = await cookies();
	cookieStore.set('admin_session', '', {
		path: '/',
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0,
	});

	console.log('Admin session cookie deleted');
}
