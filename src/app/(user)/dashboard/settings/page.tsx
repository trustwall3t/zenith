import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdateProfile from '../_components/forms/updateProfile';
import Security from '../_components/forms/Security';
import WithdrawalInformationForm from '../_components/forms/WithdrawalInformationForm';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const Settings = () => {
	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.settings}
				title='Settings'
				description='Manage profile, security, and withdrawal wallets.'
			/>
			<Tabs className='w-full' defaultValue='personal'>
				<TabsList className='w-full justify-start overflow-x-auto'>
					<TabsTrigger value='personal'>Personal</TabsTrigger>
					<TabsTrigger value='security'>Security</TabsTrigger>
					<TabsTrigger value='withdrawal'>Wallets</TabsTrigger>
				</TabsList>
				<TabsContent value='personal' className='mt-4'>
					<DashboardPanel className='p-4 sm:p-6'>
						<UpdateProfile />
					</DashboardPanel>
				</TabsContent>
				<TabsContent value='security' className='mt-4'>
					<DashboardPanel className='p-4 sm:p-6'>
						<Security />
					</DashboardPanel>
				</TabsContent>
				<TabsContent value='withdrawal' className='mt-4'>
					<DashboardPanel className='p-4 sm:p-6'>
						<WithdrawalInformationForm />
					</DashboardPanel>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Settings;
