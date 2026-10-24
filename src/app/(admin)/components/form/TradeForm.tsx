'use client';
import { TradeSchema } from '../../../../../schema/TradeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormItem,
	FormField,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';
import { placeTrade } from '@/actions/admin/placeTrade';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
	profitBalance?: number | null;
	investmentBalance?: number | null;
};

const TradeForm = ({ user }: { user: UserData | null }) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof TradeSchema>>({
		resolver: zodResolver(TradeSchema),
		defaultValues: {
			pair: '',
			type: '',
			amount: '',
			userId: user?.id || '',
		},
	});

	const onSubmit = async (data: z.infer<typeof TradeSchema>) => {
		if (!user?.id) {
			toast.error('Please select a user first', {
				position: 'top-right',
			});
			return;
		}
		if (!data.pair || !data.type || !data.amount) {
			toast.error('Please fill all fields', {
				position: 'top-right',
			});
			return;
		}

		startTransition(async () => {
			try {
				const result = await placeTrade({
					pair: data.pair,
					type: data.type,
					amount: data.amount,
					userId: user?.id || '',
				});
				if (result.error) {
					toast.error(result.error, {
						position: 'top-right',
					});
				} else if (result.success) {
					toast.success(result.success, {
						position: 'top-right',
					});
					form.reset();
				}
			} catch (err) {
				console.log(err);
				toast.error('An unexpected error occurred', {
					position: 'top-right',
				});
			}
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full space-y-4'
			>
				{isPending && <Loader />}

				{!user && (
					<div className='rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400'>
						Please select a user from the dropdown above
					</div>
				)}
				<FormField
					control={form.control}
					name='pair'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pair</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='BTC/USD'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='type'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Buy/Sell'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='amount'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type='text'
									{...field}
									placeholder='100'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					className='w-full'
					disabled={isPending}
				>
					Trade
				</Button>
			</form>
		</Form>
	);
};

export default TradeForm;
