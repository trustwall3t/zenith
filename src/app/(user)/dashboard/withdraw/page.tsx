import { getSession } from '@/lib/session';
import { WithdrawButton } from './withdraw-button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const Withdraw = async () => {
	const session = await getSession();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.withdraw}
				title='Withdraw'
				description='Move funds from your available balance to your wallet.'
			/>
			<DashboardPanel className='px-4 py-8 sm:px-6 sm:py-10'>
				<div className='flex flex-col items-center text-center gap-3'>
					<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Available balance
					</p>
					<p className='text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums text-foreground'>
						${session?.user?.walletBalance?.toFixed(2) || '0.00'}
					</p>
					<WithdrawButton
						id={session?.user?.id || ''}
						ethAddress={session?.user?.ethAddress || ''}
						usdtAddress={session?.user?.usdtAddress || ''}
						btcAddress={session?.user?.btcAddress || ''}
					/>
				</div>
			</DashboardPanel>
		</div>
	);
};

export default Withdraw;
