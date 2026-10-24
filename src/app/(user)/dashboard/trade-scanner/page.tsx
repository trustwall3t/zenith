import TradingView2 from '../_components/TradingView/TradingView2';
import Tradeview1 from '../_components/TradingView/Tradeview1';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const TradeScanner = () => {
	return (
		<div className='relative space-y-6'>
			<PageHeader
				icon={PageIcons.tradeScanner}
				title='Trade scanner'
				description='Scan markets and review live chart setups.'
			/>

			{/* Blurred background content (not interactive) */}
			<div
				className='pointer-events-none select-none blur-sm opacity-50 space-y-4'
				aria-hidden
			>
				<DashboardPanel className='p-2'>
					<div className='w-full h-[420px] overflow-hidden rounded-xl'>
						<Tradeview1 />
					</div>
				</DashboardPanel>
				<DashboardPanel className='p-2'>
					<div className='w-full h-[420px] overflow-hidden rounded-xl'>
						<TradingView2 />
					</div>
				</DashboardPanel>
			</div>

			{/* Access notice overlay */}
			<div className='absolute inset-0 z-20 flex items-start justify-center pt-24 sm:pt-32 px-4'>
				<div className='w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 text-center shadow-lg backdrop-blur-md'>
					<p className='text-lg font-semibold text-foreground'>
						Trade scanner locked
					</p>
					<p className='mt-2 text-sm text-muted-foreground'>
						You are not eligible to view livestream of ongoing trades.
						Please contact support for access.
					</p>
					<Button asChild className='mt-5'>
						<Link href='mailto:support@apextradezone.com'>
							Contact support
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TradeScanner;
