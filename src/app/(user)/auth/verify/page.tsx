'use client';
import VerifyForm from '../_components/VerifyForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Loader } from '@/components/Loader';
function VerifyContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get('email');

	if (!email) {
		redirect('/auth/signup');
	}

	return <VerifyForm email={email} />;
}

export default function VerifyPage() {
	return (
		<Suspense fallback={<Loader />}>
			<VerifyContent />
		</Suspense>
	);
}
