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
import { z } from 'zod';
import { ResetPasswordSchema } from '../../../../../schema/UserSchema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/actions/auth/resetPassword';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
export const ResetPasswordForm = ({ id }: { id: string }) => {
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
			id: id,
		},
	});
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
		startTransition(async () => {
			try {
				const res = await resetPassword(data);
				if (res.success) {
					toast.success(res.success, {
						position: 'top-center',
					});
					router.push('/auth/login');
				} else {
					toast.error(res.error, {
						position: 'top-center',
					});
				}
			} catch (error) {
				console.log(error);
				toast.error('An error occurred during reset password', {
					position: 'top-center',
				});
			}
		});
	};
	return (
		<div className='flex h-screen w-full items-center justify-center px-4'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10'
				>
					<h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
					<p className='text-sm text-muted-foreground'>
						Enter your new password
					</p>
					{isPending && <Loader />}
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full'
					>
						Reset Password
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

export default ResetPasswordForm;
