'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ResetPasswordSchema } from '../../../../../../schema/AdminLoginSschema';
import { z } from 'zod';
import {
	FormLabel,
	FormItem,
	Form,
	FormField,
	FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ResetPassword = () => {
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
		console.log(data);
	};

	return (
		<div className='mx-4 w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>
					Reset password
				</h1>
				<p className='text-sm text-muted-foreground'>
					Enter your new password
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										{...field}
										placeholder='Enter your password'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input
										type='password'
										{...field}
										placeholder='Confirm your password'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type='submit' className='w-full'>
						Reset password
					</Button>
				</form>
			</Form>
			<Link
				href='/admin/login'
				className='block text-sm text-muted-foreground hover:text-brand'
			>
				Back to login
			</Link>
		</div>
	);
};

export default ResetPassword;
