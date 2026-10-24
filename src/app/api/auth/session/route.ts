import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await getSession();
		if (!session) {
			return NextResponse.json({ user: null }, { status: 401 });
		}
		return NextResponse.json({ user: session.user });
	} catch (error) {
		console.error('Error in session route:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
