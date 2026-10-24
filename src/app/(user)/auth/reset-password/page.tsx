'use client';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import ResetPasswordForm from '../_components/ResetPasswordForm';
import { Suspense } from 'react';
import { Loader } from '@/components/Loader';

function ResetPasswordContent() {
	return (
		<Suspense fallback={<Loader />}>
			<ResetPasswordWrapper />
		</Suspense>
	);
}

function ResetPasswordWrapper() {
	const searchParams = useSearchParams();
	const id = searchParams.get('id');

	if (!id) {
		redirect('/auth/login');
	}

	return <ResetPasswordForm id={id} />;
}

export default function ResetPasswordPage() {
	return <ResetPasswordContent />;
}
