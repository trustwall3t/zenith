'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withdrawSchema } from '../../../../../schema/withdrawSchema';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { requestWithdrawal } from '@/actions/withdraw';
import { Loader } from '@/components/Loader';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PAYMENT_OPTIONS = [
	{ id: 'ETH', name: 'Ethereum', icon: '/dashboard/eth.svg' },
	{ id: 'USDT(ERC20)', name: 'USDT(ERC20)', icon: '/dashboard/usdt.svg' },
	{ id: 'USDT(TRC20)', name: 'USDT(TRC20)', icon: '/dashboard/usdt.svg' },
	{ id: 'BTC', name: 'Bitcoin', icon: '/dashboard/btc.svg' },
{ id: 'TRX', name: 'TRX', icon: '/dashboard/trx.svg' },
{id: 'LTC', name: 'Litecoin', icon: '/dashboard/ltc.svg' },
{id: 'DOGE', name: 'Dogecoin', icon: '/dashboard/doge.svg' },
] as const;

interface WithdrawButtonProps {
	id: string;
	ethAddress?: string;
	usdtAddress?: string;
	btcAddress?: string;
	ltcAddress?: string;
	dogeAddress?: string;
	trxAddress?: string;
}

export function WithdrawButton({
	id,
}: WithdrawButtonProps) {
	const [isPending, startTransition] = useTransition();
	type FormData = z.infer<typeof withdrawSchema>;
	const form = useForm<FormData>({
		resolver: zodResolver(withdrawSchema),
		defaultValues: {
			id,
			paymentMethod: '',
			wallet: '',
			amount: '',
		},
	});
	const selectedMethod = form.watch('paymentMethod');

	const onSubmit = (data: FormData) => {
		if (!data.paymentMethod) {
			toast.error('Please select a payment method', {
				position: 'top-center',
			});
			return;
		}
		if (!data.wallet?.trim()) {
			toast.error('Please enter your wallet address', {
				position: 'top-center',
			});
			return;
		}
		if (Number(data.amount) <= 0) {
			toast.error('Amount must be greater than 0', {
				position: 'top-center',
			});
			return;
		}
		startTransition(async () => {
			const result = await requestWithdrawal(data);
			if (result.error) {
				toast.error(result.error, {
					position: 'top-center',
				});
			} else {
				toast.success(result.success, {
					position: 'top-center',
				});
				form.reset({ ...form.getValues(), paymentMethod: '', wallet: '', amount: '' });
			}
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='mt-2'>Place withdrawal request</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Withdraw funds</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-5'
					>
						{isPending && <Loader />}

						{/* 1. List all available payment methods / coins */}
						<FormField
							control={form.control}
							name='paymentMethod'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Choose payment method</FormLabel>
									<FormControl>
										<div className='grid grid-cols-3 gap-2'>
											{PAYMENT_OPTIONS.map((option) => (
												<button
													key={option.id}
													type='button'
													onClick={() => {
														field.onChange(option.id);
														form.setValue('wallet', '');
													}}
													className={cn(
														'flex flex-col items-center gap-2 rounded-xl border p-2 transition-colors',
														selectedMethod === option.id
															? 'border-foreground bg-muted'
															: 'border-border bg-card hover:bg-muted/50'
													)}
												>
													<Image
														src={option.icon}
														alt={option.name}
														width={32}
														height={32}
													/>
													<span className='text-xs font-medium text-foreground'>
														{option.name}
													</span>
												</button>
											))}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* 2. Input for address of selected payment method */}
						{selectedMethod && (
							<FormField
								control={form.control}
								name='wallet'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{PAYMENT_OPTIONS.find((o) => o.id === selectedMethod)?.name}{' '}
											wallet address
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={`Enter your ${selectedMethod} address`}
												className='font-mono text-sm'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type='number'
											{...field}
											placeholder='Enter amount to withdraw'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type='submit' className='mt-2'>
							Withdraw
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
