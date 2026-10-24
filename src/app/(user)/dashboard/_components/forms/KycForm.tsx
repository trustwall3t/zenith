'use client';
import React, { useRef, useTransition, useState } from 'react';
import { KycSchema } from '../../../../../../schema/KycSchema'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createKyc } from '@/actions/Kyc'; 
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
import { uploadFile } from '@/lib/uploadfile'; 

const KycForm = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [submitted, setSubmitted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [uploading, setUploading] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState('');

	const form = useForm<z.infer<typeof KycSchema>>({
		resolver: zodResolver(KycSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			country: '',
			idNumber: '',
			idType: '',
			idImage: '',
		},
	});

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	async function onSubmit(values: z.infer<typeof KycSchema>) {
		const fileInput = fileInputRef.current;
		const file = fileInput?.files?.[0];

		if (!file) {
			toast.error('Please select an ID image');
			return;
		}

		try {
			// Step 1: Upload file to Cloudinary via API route
			setUploading(true);
			const imageUrl = await uploadFile(file);
			setUploading(false);

			// Step 2: Submit form data with image URL to server action
			startTransition(async () => {
				const formData = new FormData();
				formData.append('firstName', values.firstName);
				formData.append('lastName', values.lastName);
				formData.append('phone', values.phone);
				formData.append('address', values.address);
				formData.append('country', values.country);
				formData.append('idNumber', values.idNumber);
				formData.append('idType', values.idType);
				formData.append('idImage', imageUrl); // Send URL instead of file

				const result = await createKyc(formData);

				if (result.error) {
					toast.error(
						result.error.toString() || 'Something went wrong'
					);
				} else {
					toast.success('KYC submitted successfully');
					form.reset();
					setSelectedFileName('');
					if (fileInputRef.current) {
						fileInputRef.current.value = '';
					}
					setSubmitted(true);
				}
			});
		} catch (error) {
			setUploading(false);
			console.error('Upload error:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to upload file'
			);
		}
	}

	const isLoading = uploading || isPending;

	return (
		<div className='flex flex-col gap-4 mt-10 w-full md:w-5xl mx-auto'>
			{submitted ? (
				<div className='text-brand text-center h-full min-h-[500px] flex items-center flex-col gap-y-4 justify-center'>
					<div className='text-center rounded-2xl border border-brand/20 bg-brand-soft text-foreground p-5 w-full flex flex-col items-center justify-center max-w-md'>
						KYC submitted successfully, please wait while we review
						your application.
					</div>
					<Button
						onClick={() => setSubmitted(false)}
						className='min-w-[150px]'
					>
						Back to dashboard
					</Button>
				</div>
			) : (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						{isLoading && <Loader />}
						<FormField
							control={form.control}
							name='firstName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your first name'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your last name'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your phone number'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your address'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='country'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your country'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='idNumber'
							render={({ field }) => (
								<FormItem>
									<FormLabel>ID Number</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your ID number'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='idType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>ID Type</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isLoading}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select ID Type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='passport'>
													Passport
												</SelectItem>
												<SelectItem value='national_id'>
													National ID
												</SelectItem>
												<SelectItem value='driver_license'>
													Driver License
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='idImage'
							render={({ field }) => (
								<FormItem>
									<FormLabel>ID Image</FormLabel>
									<FormControl>
										<div className='relative'>
											<input
												ref={fileInputRef}
												type='file'
												accept='image/*,application/pdf'
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														const maxSize =
															10 * 1024 * 1024; // 10MB
														if (
															file.size > maxSize
														) {
															toast.error(
																'File size must be less than 10MB'
															);
															e.target.value = '';
															setSelectedFileName(
																''
															);
															return;
														}

														const fileInfo = `${
															file.name
														} (${formatFileSize(
															file.size
														)})`;
														setSelectedFileName(
															fileInfo
														);
														field.onChange(
															'file-selected'
														);
													} else {
														setSelectedFileName('');
														field.onChange('');
													}
												}}
												disabled={isLoading}
												className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
											/>
											<div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors'>
												<div className='flex flex-col items-center space-y-2'>
													<svg
														className='w-12 h-12 text-gray-400'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
														/>
													</svg>
													<div className='text-sm text-gray-600'>
														<span className='font-medium text-brand hover:text-brand-muted'>
															Click to upload
														</span>{' '}
														or drag and drop
													</div>
													<p className='text-xs text-gray-500'>
														PNG, JPG, PDF up to 10MB
													</p>
													{selectedFileName && (
														<p className='text-xs text-brand'>
															Selected:{' '}
															{selectedFileName}
														</p>
													)}
													{uploading && (
														<p className='text-xs text-brand-muted font-medium'>
															Uploading to
															cloud...
														</p>
													)}
												</div>
											</div>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant='outline'
								className='min-w-[150px]'
								onClick={() => {
									form.reset();
									setSelectedFileName('');
									if (fileInputRef.current) {
										fileInputRef.current.value = '';
									}
								}}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								className='min-w-[150px]'
								disabled={isLoading}
							>
								{uploading
									? 'Uploading...'
									: isPending
									? 'Submitting...'
									: 'Submit'}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};

export default KycForm;
