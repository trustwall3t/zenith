'use client';
import { WalletSchema } from '../../../../../../schema/walletSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { setUpWallet } from '@/actions/settings';
import { toast } from 'sonner';
import { useUser } from '@/lib/context/UserContext';

const WithdrawalInformationForm = () => {
	const { user } = useUser();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof WalletSchema>>({
		resolver: zodResolver(WalletSchema),
		defaultValues: {
			id: user?.id,
			BtcAddress: user?.btcAddress || '',
			UsdtAddress: user?.usdtAddress || '',
			EthAddress: user?.ethAddress || '',
		},
	});

	const onSubmit = async (data: z.infer<typeof WalletSchema>) => {
		startTransition(async () => {
			const res = await setUpWallet(data);
			if (res.error) {
				toast.error(res.error);
			} else {
				toast.success(res.success);
			}
		});
		console.log(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-5 max-w-2xl mx-auto mt-10'
			>
				<FormField
					control={form.control}
					name='BtcAddress'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bitcoin Wallet Address</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your Bitcoin wallet address'
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='UsdtAddress'
					render={({ field }) => (
						<FormItem>
							<FormLabel>USDT Wallet Address</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your USDT wallet address'
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='EthAddress'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ethereum Wallet Address</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your Ethereum wallet address'
									value={field.value}
									onChange={field.onChange}
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
					{isPending
						? 'Updating...'
						: 'Update Withdrawal Information'}
				</Button>
			</form>
		</Form>
	);
};

export default WithdrawalInformationForm;
