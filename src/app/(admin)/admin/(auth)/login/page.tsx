'use client';

import { AdminLoginSchema } from '../../../../../../schema/AdminLoginSschema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Form,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { loginAdmin } from '@/actions/auth/admin';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';
const AdminLogin = () => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof AdminLoginSchema>>({
		resolver: zodResolver(AdminLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: z.infer<typeof AdminLoginSchema>) => {
		startTransition(async () => {
			const response = await loginAdmin({
				email: data.email.trim().toLowerCase(),
				password: data.password,
			});
			if (response?.error) {
				toast.error(response.error);
				return;
			}
			if (response?.redirect) {
				router.push(response.redirect);
				router.refresh();
			}
		});
	};

	return (
		<div className='mx-4 w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm sm:p-10'>
			<div>
				<h1 className='text-2xl font-semibold text-foreground'>
					Manager login
				</h1>
				<p className='text-sm text-muted-foreground'>
					Login to your manager account
				</p>
			</div>
			<Form {...form}>
				{isPending && <Loader />}
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
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type='password' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex flex-col gap-3'>
						<Link
							href='/admin/forgot-password'
							className='text-sm text-muted-foreground hover:text-brand'
						>
							Forgot password?
						</Link>
						<Button
							type='submit'
							className='w-full'
							disabled={isPending}
						>
							Login
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default AdminLogin;
