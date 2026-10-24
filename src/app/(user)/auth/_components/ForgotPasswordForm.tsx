'use client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { z } from 'zod';
import { ForgotPasswordSchema } from '../../../../../schema/UserSchema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requestResetPassword } from '../../../../actions/auth/resetPassword';
import { toast } from 'sonner';
export const ForgotPasswordForm = () => {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const handleSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
		startTransition(async () => {
			try {
				const response = await requestResetPassword(data.email);
				if (response.error) {
					toast.error(response.error, {
						position: 'top-center',
					});
				} else {
					toast.success(response.success, {
						position: 'top-center',
					});
					form.reset();
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast.error(error.message || 'An error occurred');
				} else {
					toast.error('An error occurred');
				}
			}
		});
	};
	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='mx-5 w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm md:p-10'
				>
					<h1 className="text-xl font-semibold tracking-tight">Forgot password</h1>
					<p className='text-sm text-muted-foreground'>
						Enter your email to request a password reset link
					</p>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Enter your email'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full'
						disabled={isPending}
					>
						{isPending ? 'Sending...' : 'Request Reset Link'}
					</Button>
					<Link
						href='/auth/login'
						className='text-sm text-muted-foreground hover:text-brand'
					>
						Back to login
					</Link>
				</form>
			</Form>
		</div>
	);
};

export default ForgotPasswordForm;
