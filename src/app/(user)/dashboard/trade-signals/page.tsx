import { Radio } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DashboardEmptyState } from '@/components/dashboard/DashboardPanel';
import { PageIcons } from '@/lib/icons/page-icons';

const TradeSignals = () => {
	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.tradeSignals}
				title='Trade signals'
				description='Get notified when a trade setup is triggered.'
			/>
			<DashboardEmptyState
				title='No signals right now'
				description='Trade signals will appear here when available for your account.'
				action={
					<span className='inline-flex items-center gap-2 text-muted-foreground'>
						<Radio className='h-5 w-5 animate-pulse' strokeWidth={2} />
						<span className='text-xs'>Listening for alerts</span>
					</span>
				}
			/>
		</div>
	);
};

export default TradeSignals;
