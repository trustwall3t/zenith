import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchem } from '../../../../../schema/UserSchema';
import { z } from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { verifyEmail } from '@/actions/auth/signup';
import { Loader } from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { requestForToken } from '@/actions/auth/resetPassword';

const VerifyForm = ({ email }: { email: string }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<z.infer<typeof verifyEmailSchem>>({
		resolver: zodResolver(verifyEmailSchem),
		defaultValues: {
			token: '',
			email: email || '',
		},
	});

	const onSubmit = (data: z.infer<typeof verifyEmailSchem>) => {
		if (!data.token) {
			toast.error('Token is required');
			return;
		}
		if (!data.email) {
			toast.error('Email is required');
			return;
		}
		startTransition(async () => {
			try {
				const res = await verifyEmail(data);
				if (res.success) {
					toast.success(res.success, {
						position: 'top-center',
					});
					router.push('/auth/login');
				}
				if (res.error) {
					toast.error(res.error, {
						position: 'top-center',
					});
				}
			} catch (error) {
				console.log(error);
				toast.error('An error occurred during verification', {
					position: 'top-center',
				});
			}
		});
	};
	return (
		<div className='flex h-screen w-full flex-col items-center justify-center px-4'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='my-auto w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10'
				>
					<h1 className='text-2xl font-bold text-foreground'>
						Verify {email}
					</h1>
					<p className='text-sm text-muted-foreground'>
						Enter the token sent to your email
					</p>
					{isPending && <Loader />}
					<FormField
						control={form.control}
						name='token'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-2'>
								<FormLabel>Token</FormLabel>
								<FormControl>
									<Input
										type='text'
										{...field}
										placeholder='Enter the token'
										disabled={isPending}
									/>
								</FormControl>
								{form.formState.errors.token && (
									<p className='text-sm text-red-500'>
										{form.formState.errors.token.message}
									</p>
								)}
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full'
						disabled={isPending}
					>
						{isPending ? 'Verifying...' : 'Verify'}
					</Button>
				</form>
				<div className='mb-10 flex w-full items-center justify-center gap-2'>
					<p className='text-sm text-muted-foreground'>
						Didn&apos;t get code ?
					</p>
					<Button
						variant='outline'
						className='text-sm cursor-pointer border-none bg-primary text-primary-foreground hover:bg-brand-muted'
						onClick={() => {
							requestForToken(email);
						}}
						
					>
						Resend Token
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default VerifyForm;
