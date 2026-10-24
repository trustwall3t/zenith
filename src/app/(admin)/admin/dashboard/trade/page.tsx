import {
	TableHeader,
	TableRow,
	Table,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import {
	getAllTrades,
	getAllTrade,
	getAllApprovedTrade,
	getAllCancelledTrade,
} from '@/actions/admin/getAlltrade';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { StatCard } from '@/components/dashboard/StatCard';
import {
	DashboardEmptyState,
	DashboardPanel,
} from '@/components/dashboard/DashboardPanel';
import { cn } from '@/lib/utils';

const Trade = async () => {
	const [totalTrade, successTrade, cancelledTrade, trade] = await Promise.all([
		getAllTrades(),
		getAllApprovedTrade(),
		getAllCancelledTrade(),
		getAllTrade(),
	]);

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.adminTrade}
				title='Trade history'
				description='All platform trading activity.'
			/>

			<div className='grid gap-4 sm:grid-cols-3'>
				<StatCard label='Total trades' value={totalTrade.toLocaleString()} />
				<StatCard
					label='Successful trades'
					value={successTrade.toLocaleString()}
				/>
				<StatCard
					label='Cancelled trades'
					value={cancelledTrade.toLocaleString()}
				/>
			</div>

			{trade.length === 0 ? (
				<DashboardEmptyState
					title='No trades yet'
					description='Completed trades will appear in this table.'
				/>
			) : (
				<DashboardPanel>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Pair</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trade.map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											{item.date.toLocaleDateString()}
										</TableCell>
										<TableCell>{item.user.name}</TableCell>
										<TableCell>{item.postType}</TableCell>
										<TableCell
											className={cn(
												'capitalize font-medium',
												item.type === 'buy'
													? 'text-brand'
													: 'text-destructive'
											)}
										>
											{item.type}
										</TableCell>
										<TableCell className='tabular-nums'>
											{item.amount}
										</TableCell>
										<TableCell>
											<SuccessBadge />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</DashboardPanel>
			)}
		</div>
	);
};

export default Trade;
