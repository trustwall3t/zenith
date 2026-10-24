'use client';

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { dashboardSettingSchema } from '../../../../../../schema/dashboardSettingSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const Settings = () => {
	const form = useForm<z.infer<typeof dashboardSettingSchema>>({
		resolver: zodResolver(dashboardSettingSchema),
		defaultValues: {
			siteName: '',
		},
	});

	const onSubmit = (values: z.infer<typeof dashboardSettingSchema>) => {
		console.log(values);
	};

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.settings}
				title='Settings'
				description='Configure site identity and contact details.'
			/>

			<DashboardPanel className='p-4 sm:p-6'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							<FormField
								control={form.control}
								name='siteName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site name</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='text'
												placeholder='My Site'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteDescription'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site description</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='This is a description of the site'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteEmail'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site email</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='example@gmail.com'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='sitePhone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site phone</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='+1234567890'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteAddress'
								render={({ field }) => (
									<FormItem className='md:col-span-2'>
										<FormLabel>Site address</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='123 Main St, Anytown, USA'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='copyrightYear'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Copyright year</FormLabel>
										<FormControl>
											<Input {...field} placeholder='2025' />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteLogo'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site logo</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='file'
												className='h-auto cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-brand-muted'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteFavicon'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site favicon</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='file'
												className='h-auto cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-brand-muted'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button type='submit'>Save settings</Button>
					</form>
				</Form>
			</DashboardPanel>
		</div>
	);
};

export default Settings;
