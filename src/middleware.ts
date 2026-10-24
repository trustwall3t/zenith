import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuthMiddleware } from './middleware/admin-auth';

function nextWithPathname(request: NextRequest, extraResponseHeaders?: Headers) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-pathname', request.nextUrl.pathname);

	const response = NextResponse.next({
		request: { headers: requestHeaders },
	});

	if (extraResponseHeaders) {
		extraResponseHeaders.forEach((value, key) => {
			response.headers.set(key, value);
		});
	}

	return response;
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (pathname.startsWith('/admin')) {
		const adminResponse = await adminAuthMiddleware(request);
		if (adminResponse.status !== 200) {
			return adminResponse;
		}
		return nextWithPathname(request, adminResponse.headers);
	}

	const response = nextWithPathname(request);
	// Client hint for more accurate SSR viewport scale on repeat visits.
	response.headers.set('Accept-CH', 'Sec-CH-Viewport-Width, Sec-CH-Viewport-Height');
	response.headers.set('Critical-CH', 'Sec-CH-Viewport-Width');
	return response;
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
	],
};
