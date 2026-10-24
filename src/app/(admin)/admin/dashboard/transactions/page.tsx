import {
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
	TableBody,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import { getAllTransactions } from '@/actions/admin/getAlltransactions';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import {
	DashboardEmptyState,
	DashboardPanel,
} from '@/components/dashboard/DashboardPanel';

const Transactions = async () => {
	const transactions = await getAllTransactions();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.transactions}
				title='Transactions'
				description='Full ledger of deposits, withdrawals, and trades.'
			/>

			{transactions.length === 0 ? (
				<DashboardEmptyState
					title='No transactions'
					description='Platform activity will appear here.'
				/>
			) : (
				<DashboardPanel>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Transaction ID</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Payment method</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{transactions.map((transaction) => (
									<TableRow key={transaction.transactionId}>
										<TableCell>
											{transaction.createdAt.toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</TableCell>
										<TableCell className='font-mono text-xs'>
											{transaction.transactionId}
										</TableCell>
										<TableCell>{transaction.user.name}</TableCell>
										<TableCell className='tabular-nums'>
											{transaction.amount}
										</TableCell>
										<TableCell>{transaction.transactionType}</TableCell>
										<TableCell>{transaction.paymentMethod}</TableCell>
										<TableCell>
											{transaction.status === 'success' ? (
												<SuccessBadge />
											) : transaction.status === 'pending' ? (
												<PendingBadge />
											) : (
												<CancelledBadge />
											)}
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

export default Transactions;
