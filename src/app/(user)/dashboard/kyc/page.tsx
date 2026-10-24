import { BadgeCheck } from 'lucide-react';
import { PageIcons } from '@/lib/icons/page-icons';
import KycForm from '../_components/forms/KycForm';
import { getSession } from '@/lib/session';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const KycPage = async () => {
	const session = await getSession();
	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.kyc}
				title='KYC verification'
				description='Verify your identity to unlock full account features.'
			/>
			{session?.user.isVerified ? (
				<DashboardPanel className='flex flex-col items-center justify-center gap-3 px-6 py-16 text-center'>
					<span className='flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft'>
						<BadgeCheck className='h-6 w-6 text-brand' strokeWidth={2} />
					</span>
					<p className='text-sm font-medium text-foreground'>
						Your KYC has been approved
					</p>
					<p className='text-xs text-muted-foreground'>
						Your account is verified and ready for full access.
					</p>
				</DashboardPanel>
			) : (
				<DashboardPanel className='p-4 sm:p-6'>
					<p className='mb-4 text-sm text-muted-foreground'>
						Please fill in the form below to complete your KYC.
					</p>
					<KycForm />
				</DashboardPanel>
			)}
		</div>
	);
};

export default KycPage;
