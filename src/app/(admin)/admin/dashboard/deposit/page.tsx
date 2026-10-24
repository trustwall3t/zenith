import {
	Table,
	TableRow,
	TableHead,
	TableHeader,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { getDepositRequest } from '@/actions/admin/getDepositRequest';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import HandleButton from './HandleButton';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import {
	DashboardEmptyState,
	DashboardPanel,
} from '@/components/dashboard/DashboardPanel';

const Deposit = async () => {
	const depositRequest = await getDepositRequest();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.deposit}
				title='Deposit requests'
				description='Review and process incoming deposits.'
			/>

			{depositRequest.length === 0 ? (
				<DashboardEmptyState
					title='No deposit requests'
					description='New deposit submissions will show up here.'
				/>
			) : (
				<DashboardPanel>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{depositRequest.map((deposit) => (
									<TableRow key={deposit.id}>
										<TableCell>
											{deposit.createdAt.toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</TableCell>
										<TableCell>{deposit.user.name}</TableCell>
										<TableCell className='tabular-nums'>
											{deposit.amount}
										</TableCell>
										<TableCell>{deposit.paymentMethod}</TableCell>
										<TableCell>
											{deposit.status === 'pending' ? (
												<PendingBadge />
											) : deposit.status === 'success' ? (
												<SuccessBadge />
											) : (
												<CancelledBadge />
											)}
										</TableCell>
										<TableCell>
											<HandleButton
												depositId={deposit.id}
												userId={deposit.userId}
											/>
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

export default Deposit;
