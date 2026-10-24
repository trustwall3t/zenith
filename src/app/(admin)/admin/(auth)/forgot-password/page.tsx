'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AdminForgotPasswordSchema } from '../../../../../../schema/AdminLoginSschema';
import {
	FormField,
	FormLabel,
	FormItem,
	FormControl,
	Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AdminForgotPassword = () => {
	const form = useForm<z.infer<typeof AdminForgotPasswordSchema>>({
		resolver: zodResolver(AdminForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = (data: z.infer<typeof AdminForgotPasswordSchema>) => {
		console.log(data);
	};

	return (
		<div className='mx-4 w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>
					Forgot password
				</h1>
				<p className='text-sm text-muted-foreground'>
					Enter your email to reset your password
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type='email' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type='submit' className='w-full'>
						Send reset link
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

export default AdminForgotPassword;
