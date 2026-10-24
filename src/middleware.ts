import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuthMiddleware } from './middleware/admin-auth';

export async function middleware(request: NextRequest) {
	let response: NextResponse;

	if (request.nextUrl.pathname.startsWith('/admin')) {
		response = await adminAuthMiddleware(request);
	} else {
		response = NextResponse.next();
	}

	response.headers.set('x-pathname', request.nextUrl.pathname);
	return response;
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
	],
};
