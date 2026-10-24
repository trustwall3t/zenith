'use client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserLoginSchema } from '../../../../../schema/UserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { login } from '@/actions/auth/login';
import {  useTransition } from 'react';
import { Loader } from '@/components/Loader';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
export const LoginForm = () => {
	const [isPending, startTransition] = useTransition();
	const { setUser } = useUser();
	const router = useRouter();

	const form = useForm<z.infer<typeof UserLoginSchema>>({
		resolver: zodResolver(UserLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	
	const onSubmit = (data: z.infer<typeof UserLoginSchema>) => {
		if (data.email === '' || data.password === '') {
			toast.error('Please enter your email and password',{
				position: 'top-center',
			});
		}
		startTransition(async () => {
			const res = await login(data);
			if (res.success) {
				setUser(res.user);
				router.push('/dashboard');
			} else {
				toast.error(res.error,{
					position: 'top-center',
				});
				// You might want to show an error message to the user here
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
					<h1 className="text-xl font-semibold tracking-tight text-foreground">
						Sign in
					</h1>
					{isPending && <Loader />}
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='mt-7'>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										{...field}
										placeholder='Enter your email'
									/>
								</FormControl>
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
									<Input
										type='password'
										{...field}
										placeholder='Enter your password'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Link
						href='/auth/forgot-password'
						className='block text-sm text-muted-foreground hover:text-brand'
					>
						Forgot password?
					</Link>
					<Button
						type='submit'
						className='w-1/2'
						disabled={isPending}
					>
						Login
					</Button>
					<Link
						href='/auth/signup'
						className='block text-sm text-muted-foreground hover:text-brand'
					>
						Don&apos;t have an account? Sign up
					</Link>
				</form>
			</Form>
		</div>
	);
};
