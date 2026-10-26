import { getUserById } from '@/actions/admin/users';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminLoginAsUserButton } from '@/components/admin/AdminLoginAsUserButton';

function formatMoney(value: number | null | undefined) {
	return `$${(value ?? 0).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

const ViewUser = async ({ params }: { params: Promise<{ id: string }> }) => {
	const resolvedParams = await params;
	const user = await getUserById(resolvedParams.id);

	if (!user) {
		return (
			<div className='space-y-6'>
				<PageHeader title='User not found' />
				<Button asChild variant='outline'>
					<Link href='/admin/dashboard/users'>Back to users</Link>
				</Button>
			</div>
		);
	}

	const details = [
		{ label: 'Email', value: user.email },
		{ label: 'Phone', value: user.phone },
		{ label: 'BTC address', value: user.btcAddress || '—' },
		{ label: 'ETH address', value: user.ethAddress || '—' },
		{ label: 'USDT address', value: user.usdtAddress || '—' },
		{
			label: 'Yearly income range',
			value:
				'yearlyIncomeRange' in user && user.yearlyIncomeRange != null
					? String(user.yearlyIncomeRange)
					: 'N/A',
		},
		{ label: 'Country', value: user.country || '—' },
		{
			label: 'KYC status',
			value: user.isVerified ? 'Verified' : 'Not verified',
		},
		{ label: 'Referral code', value: user.refcode || '—' },
	];

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.users}
				title={user.name}
				description='Account balances and profile details.'
				actions={
					<div className='flex flex-wrap items-center gap-2'>
						<AdminLoginAsUserButton userId={user.id} variant='default' />
						<Button asChild variant='outline' size='sm'>
							<Link href='/admin/dashboard/users'>Back</Link>
						</Button>
					</div>
				}
			/>

			<div className='grid gap-4 sm:grid-cols-3'>
				<StatCard label='Wallet balance' value={formatMoney(user.walletBalance)} />
				<StatCard
					label='Invested amount'
					value={formatMoney(user.investmentBalance)}
				/>
				<StatCard
					label='Profit earned'
					value={formatMoney(user.profitBalance)}
				/>
			</div>

			<DashboardPanel className='divide-y divide-border'>
				{details.map((item) => (
					<div
						key={item.label}
						className='flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5'
					>
						<p className='text-sm text-muted-foreground'>{item.label}</p>
						<p className='text-sm font-medium text-foreground break-all'>
							{item.value}
						</p>
					</div>
				))}
			</DashboardPanel>
		</div>
	);
};

export default ViewUser;
