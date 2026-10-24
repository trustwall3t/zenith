import { Button } from '@/components/ui/button';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { CircleCheck, CircleX, Trash2 } from 'lucide-react';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import {
	approveWithdrawalRequest,
	deleteWithdrawalRequest,
	getAllWithdrawalRequest,
	rejectWithdrawalRequest,
} from '@/actions/admin/getWithdrawalRequest';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import {
	DashboardEmptyState,
	DashboardPanel,
} from '@/components/dashboard/DashboardPanel';

const Withdrawal = async () => {
	const withdrawalRequest = await getAllWithdrawalRequest();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.withdraw}
				title='Withdrawal requests'
				description='Approve or reject outbound withdrawals.'
			/>

			{withdrawalRequest.length === 0 ? (
				<DashboardEmptyState
					title='No withdrawal requests'
					description='New withdrawal submissions will show up here.'
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
									<TableHead>Wallet address</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{withdrawalRequest.map((request) => (
									<TableRow key={request.id}>
										<TableCell>
											{request.createdAt.toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</TableCell>
										<TableCell>{request.user.name}</TableCell>
										<TableCell className='tabular-nums'>
											{request.amount}
										</TableCell>
										<TableCell className='max-w-[12rem] truncate'>
											{request.postType}
										</TableCell>
										<TableCell>{request.paymentMethod}</TableCell>
										<TableCell>
											{request.status === 'pending' ? (
												<PendingBadge />
											) : request.status === 'success' ? (
												<SuccessBadge />
											) : (
												<CancelledBadge />
											)}
										</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<form
													action={async () => {
														'use server';
														await approveWithdrawalRequest(request.id);
													}}
												>
													<Button
														type='submit'
														size='icon'
														variant='default'
													>
														<CircleCheck className='h-4 w-4' strokeWidth={2} />
													</Button>
												</form>
												<form
													action={async () => {
														'use server';
														await rejectWithdrawalRequest(request.id);
													}}
												>
													<Button
														type='submit'
														size='icon'
														variant='secondary'
													>
														<CircleX className='h-4 w-4' strokeWidth={2} />
													</Button>
												</form>
												<form
													action={async () => {
														'use server';
														await deleteWithdrawalRequest(request.id);
													}}
												>
													<Button
														type='submit'
														size='icon'
														variant='destructive'
													>
														<Trash2 className='h-4 w-4' strokeWidth={2} />
													</Button>
												</form>
											</div>
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

export default Withdrawal;
