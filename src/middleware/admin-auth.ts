import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
);

// Simple in-memory store for rate limiting
// In production, use Redis or similar
const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 0 * 60 * 1000; // 15 minutes

export async function adminAuthMiddleware(request: NextRequest) {
	// Only apply to admin routes
	if (!request.nextUrl.pathname.startsWith('/admin')) {
		return NextResponse.next();
	}

	// Skip auth check for login page
	if (request.nextUrl.pathname === '/admin/login') {
		// Rate limiting for login attempts
		const ip =
			request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			'unknown';
		const now = Date.now();
		const attempt = loginAttempts.get(ip);

		if (attempt) {
			if (now - attempt.timestamp > WINDOW_MS) {
				// Reset if window has passed
				loginAttempts.set(ip, { count: 1, timestamp: now });
			} else if (attempt.count >= MAX_ATTEMPTS) {
				// Too many attempts
				return new NextResponse(
					JSON.stringify({
						error: 'Too many login attempts. Please try again later.',
					}),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} else {
				// Increment attempt count
				attempt.count++;
			}
		} else {
			// First attempt
			loginAttempts.set(ip, { count: 1, timestamp: now });
		}

		return NextResponse.next();
	}

	// Check admin session for protected routes
	const sessionToken = request.cookies.get('admin_session')?.value;

	if (!sessionToken) {
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}

	try {
		// Verify JWT token
		 await jwtVerify(sessionToken, JWT_SECRET);

		// Add security headers
		const response = NextResponse.next();
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-XSS-Protection', '1; mode=block');
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains'
		);

		return response;
	} catch (error) {
		// If token verification fails, redirect to login
		console.log(error)
		return NextResponse.redirect(new URL('/admin/login', request.url));
	}
}
