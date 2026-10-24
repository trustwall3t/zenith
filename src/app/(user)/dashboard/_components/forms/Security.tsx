'use client';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { PasswordSchema } from '../../../../../../schema/passwordSchema';
import { updatePassword } from '@/actions/settings';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
import { useUser } from '@/lib/context/UserContext';

const Security = () => {
	const { user } = useUser();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			id: user?.id,
			password: '',
			confirmPassword: '',
		},
	});
	const onSubmit = (data: z.infer<typeof PasswordSchema>) => {
		startTransition(async () => {
			const res = await updatePassword(data);
			if (res.success) {
				toast.success(res.success);
			} else {
				toast.error(res.error);
			}
		});
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-5 max-w-2xl mx-auto mt-10'
			>
				{isPending && <Loader />}
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter new password'
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
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Confirm new password'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					disabled={isPending}
					type='submit'
					className='w-full'
				>
					Update Password
				</Button>
			</form>
		</Form>
	);
};

export default Security;
