import {
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import { getAllTransactions } from '@/actions/getAllTransactions';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const AllTransactions = async () => {
	const transactions = await getAllTransactions();
	return (
		<DashboardPanel>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='border-border hover:bg-transparent'>
							<TableHead>Date</TableHead>
							<TableHead>Transaction ID</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Payment Method</TableHead>
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
									${transaction.amount.toFixed(2)}
								</TableCell>
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
	);
};

export default AllTransactions;
