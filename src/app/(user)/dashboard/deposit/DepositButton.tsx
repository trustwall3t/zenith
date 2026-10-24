'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from '@/components/ui/dialog';

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/Loader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { depositSchema } from '../../../../../schema/depositSchema';
import Image from 'next/image';
import { useTransition, useState, type FormEvent } from 'react';
import { deposit } from '@/actions/deposit';
import { toast } from 'sonner';

interface PaymentMethod {
	name: string;
	barcode: string;
	network: string;
	address: string;
}

const DepositButton = ({ method }: { method: PaymentMethod }) => {
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const [submit, setSubmit] = useState(false);
	const form = useForm<z.infer<typeof depositSchema>>({
		resolver: zodResolver(depositSchema),
		defaultValues: {
			amount: '',
			method: method?.name || '',
		},
	});

	const onSubmit = async (data: z.infer<typeof depositSchema>) => {
		try {
			const formData = new FormData();
			formData.append('amount', data.amount);
			formData.append('method', data.method);
			startTransition(async () => {
				try {
					const res = await deposit(formData);
					if (res.success) {
						toast.success(res.success, {
							position: 'top-center',
						});
						setSubmit(true);
						form.reset();
					} else {
						toast.error(res.error, {
							position: 'top-center',
						});
					}
				} catch (error) {
					console.error('Error in deposit action:', error);
					toast.error(
						'An error occurred while processing your deposit',
						{
							position: 'top-center',
						}
					);
				}
			});
		} catch (error) {
			console.error('Error in form submission:', error);
			toast.error('An error occurred while submitting the form', {
				position: 'top-center',
			});
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const isValid = await form.trigger();
		if (isValid) {
			const data = form.getValues();
			await onSubmit(data);
		} else {
			const errors = form.formState.errors;

			if (errors.amount) {
				toast.error(
					errors.amount.message || 'Please enter a valid amount',
					{
						position: 'top-center',
					}
				);
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='sm'>Deposit</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Deposit</DialogTitle>
					<DialogDescription>
						{submit
							? 'Scan the QR code to deposit into your account'
							: 'Enter the amount you want to deposit.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit}>
						<div className='grid gap-y-4 p-2'>
							{submit && (
								<Image
									src={method?.barcode || '/dashboard/btc-f.jpeg'}
									alt={method?.name || 'bitcoin'}
									width={100}
									height={100}
									className='w-full object-cover rounded-xl border border-border'
								/>
							)}
							<div className='flex flex-col gap-5 col-span-2'>
								{!submit && (
									<>
										<p className='text-sm text-muted-foreground'>
											Please enter the amount you want to deposit.
										</p>
										<h2 className='text-base font-semibold capitalize text-foreground'>
											Deposit with {method?.name}({method?.network})
										</h2>
										{isPending && <Loader />}
										<FormField
											control={form.control}
											name='amount'
											render={({ field }) => (
												<FormItem className='w-full'>
													<FormLabel>Amount (USD)</FormLabel>
													<FormControl>
														<Input
															type='text'
															{...field}
															className='h-11'
															placeholder='0.00'
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<input
											type='hidden'
											{...form.register('method')}
											value={method?.name || ''}
										/>
									</>
								)}
								{submit && (
									<>
										<p className='text-sm font-medium text-foreground'>
											Deposit address
										</p>
										<div className='w-full border border-border rounded-xl h-10 flex items-center px-3 bg-muted/40'>
											<span className='text-[10px] md:text-xs truncate font-medium text-foreground'>
												{method?.address || ''}
											</span>
										</div>
										<Button
											type='button'
											variant='outline'
											className='max-w-[100px]'
											onClick={() => {
												if (method?.address) {
													navigator.clipboard.writeText(
														method.address
													);
													toast.success(
														'Address copied to clipboard',
														{ position: 'top-center' }
													);
												}
											}}
										>
											Copy
										</Button>
									</>
								)}
							</div>
						</div>
						{!submit && (
							<div className='mt-8 flex justify-end gap-2 border-t border-border pt-4 w-full'>
								<Button
									type='button'
									onClick={() => setOpen(false)}
									variant='outline'
								>
									Close
								</Button>
								<Button type='submit'>Deposit</Button>
							</div>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default DepositButton;
