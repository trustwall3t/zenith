'use client';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import {
	DashboardPanel,
	DashboardEmptyState,
} from '@/components/dashboard/DashboardPanel';
import { toast } from 'sonner';

const Referrals = () => {
	const referralLink =
		'https://finitedome.vercel.app/auth/signup?referral=1234567890';
	const referrals: {
		id: number;
		name: string;
		email: string;
		amount: number;
		date: string;
	}[] = [];

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.invite}
				title='Invite friends'
				description='Share your link and earn 10% of referred trading profits.'
			/>

			<DashboardPanel className='p-4 sm:p-6 space-y-4'>
				<div>
					<p className='text-sm font-semibold text-foreground'>
						Your referral link
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Copy and share this link with friends to start earning.
					</p>
				</div>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<code className='flex-1 truncate rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-xs sm:text-sm text-foreground'>
						{referralLink}
					</code>
					<Button
						variant='outline'
						onClick={() => {
							navigator.clipboard.writeText(referralLink);
							toast.success('Referral link copied', {
								position: 'top-center',
							});
						}}
					>
						Copy link
					</Button>
				</div>
			</DashboardPanel>

			<div className='space-y-3'>
				<div>
					<h2 className='text-sm font-semibold text-foreground'>
						Your referrals
					</h2>
					<p className='text-xs text-muted-foreground'>
						People who signed up with your link
					</p>
				</div>
				{referrals.length > 0 ? (
					<DashboardPanel>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='border-border hover:bg-transparent'>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead className='text-right'>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{referrals.map((referral) => (
										<TableRow key={referral.id}>
											<TableCell className='font-medium'>
												{referral.name}
											</TableCell>
											<TableCell>{referral.email}</TableCell>
											<TableCell className='tabular-nums'>
												{referral.amount}
											</TableCell>
											<TableCell className='text-right'>
												{referral.date}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</DashboardPanel>
				) : (
					<DashboardEmptyState
						title='No referrals yet'
						description='Share your link to start building your referral list.'
					/>
				)}
			</div>
		</div>
	);
};

export default Referrals;
