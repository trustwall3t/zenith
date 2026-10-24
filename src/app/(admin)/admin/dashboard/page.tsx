import Link from 'next/link';
import {
	ArrowDownToLine,
	ArrowUpFromLine,
	Activity,
	ChartCandlestick,
	ReceiptText,
	ShieldCheck,
	UserCog,
	Users,
	TrendingUp,
} from 'lucide-react';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';

function formatCount(value: number) {
	return value.toLocaleString();
}

function formatMoney(value: number) {
	return `$${value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function statusTone(status: string) {
	const s = status.toLowerCase();
	if (s === 'success' || s === 'approved') return 'text-brand';
	if (s === 'pending') return 'text-amber-600 dark:text-amber-400';
	if (s === 'cancelled' || s === 'rejected' || s === 'failed') {
		return 'text-destructive';
	}
	return 'text-muted-foreground';
}

function activityLabel(tx: {
	transactionType: string;
	type: string;
	postType: string;
}) {
	const raw = (
		tx.transactionType ||
		tx.type ||
		tx.postType ||
		'Transaction'
	).toLowerCase();
	if (raw.includes('deposit')) return 'Deposit';
	if (raw.includes('withdraw')) return 'Withdrawal';
	if (raw.includes('profit')) return 'Profit credit';
	if (raw.includes('trad')) return 'Trade';
	return tx.transactionType || tx.type || 'Transaction';
}

const actions = [
	{
		label: 'Deposits',
		href: '/admin/dashboard/deposit',
		icon: ArrowDownToLine,
	},
	{
		label: 'Withdraw',
		href: '/admin/dashboard/withdrawal',
		icon: ArrowUpFromLine,
	},
	{
		label: 'Users',
		href: '/admin/dashboard/users',
		icon: Users,
	},
	{
		label: 'KYC',
		href: '/admin/dashboard/kyc',
		icon: ShieldCheck,
	},
	{
		label: 'Live trade',
		href: '/admin/dashboard/livetrade',
		icon: Activity,
	},
	{
		label: 'Copy traders',
		href: '/admin/dashboard/copy-traders',
		icon: UserCog,
	},
	{
		label: 'Ledger',
		href: '/admin/dashboard/transactions',
		icon: ReceiptText,
	},
	{
		label: 'Investment plans',
		href: '/admin/dashboard/plans',
		icon: TrendingUp,
	},
] as const;

const AdminDashboard = async () => {
	const [
		totalUsers,
		verifiedUsers,
		totalTrades,
		depositStats,
		withdrawalStats,
		pendingDeposits,
		pendingWithdrawals,
		pendingKyc,
		recentActivity,
	] = await Promise.all([
		db.user.count(),
		db.user.count({ where: { isVerified: true } }),
		db.transaction.count({ where: { transactionType: 'trading' } }),
		db.transaction.aggregate({
			where: { transactionType: 'deposit', status: 'success' },
			_sum: { amount: true },
			_count: true,
		}),
		db.transaction.aggregate({
			where: { transactionType: 'withdrawal', status: 'success' },
			_sum: { amount: true },
			_count: true,
		}),
		db.transaction.count({
			where: { transactionType: 'deposit', status: 'pending' },
		}),
		db.transaction.count({
			where: { transactionType: 'withdrawal', status: 'pending' },
		}),
		db.kyc.count({ where: { status: 'pending' } }),
		db.transaction.findMany({
			orderBy: { createdAt: 'desc' },
			take: 6,
			select: {
				id: true,
				amount: true,
				status: true,
				transactionType: true,
				type: true,
				postType: true,
				createdAt: true,
				user: { select: { name: true } },
			},
		}),
	]);

	const depositVolume = depositStats._sum.amount ?? 0;
	const withdrawalVolume = withdrawalStats._sum.amount ?? 0;
	const netFlow = depositVolume - withdrawalVolume;
	const attentionCount =
		pendingDeposits + pendingWithdrawals + pendingKyc;
	const verificationRate =
		totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

	const queueItems = [
		{
			label: 'Pending deposits',
			value: formatCount(pendingDeposits),
			href: '/admin/dashboard/deposit',
			tone: pendingDeposits > 0,
		},
		{
			label: 'Pending withdrawals',
			value: formatCount(pendingWithdrawals),
			href: '/admin/dashboard/withdrawal',
			tone: pendingWithdrawals > 0,
		},
		{
			label: 'Pending KYC',
			value: formatCount(pendingKyc),
			href: '/admin/dashboard/kyc',
			tone: pendingKyc > 0,
		},
	];

	return (
		<div className='flex w-full flex-col gap-5'>
			{/* Header */}
			<div className='flex items-end justify-between gap-3'>
				<div className='min-w-0'>
					<p className='text-sm text-muted-foreground'>Operations</p>
					<h1 className='truncate text-lg font-semibold tracking-tight text-foreground'>
						Admin console
					</h1>
				</div>
				<p className='shrink-0 text-xs tabular-nums text-muted-foreground'>
					{attentionCount > 0 ? (
						<>
							<span className='font-medium text-amber-600 dark:text-amber-400'>
								{formatCount(attentionCount)}
							</span>{' '}
							open for review
						</>
					) : (
						'No open reviews'
					)}
				</p>
			</div>

			{/* Platform volume hero */}
			<section className='rounded-2xl border border-border bg-card px-4 py-5 sm:px-6 sm:py-6'>
				<div className='flex flex-col items-center text-center'>
					<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Approved deposit volume
					</p>
					<p className='mt-1.5 text-[2rem] font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-4xl'>
						{formatMoney(depositVolume)}
					</p>
					<div className='mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs'>
						<span
							className={cn(
								'font-medium tabular-nums',
								netFlow > 0
									? 'text-brand'
									: netFlow < 0
										? 'text-destructive'
										: 'text-muted-foreground'
							)}
						>
							Net flow{' '}
							{netFlow >= 0 ? '+' : '-'}
							{formatMoney(Math.abs(netFlow))}
						</span>
						<span className='text-border'>·</span>
						<span className='tabular-nums text-muted-foreground'>
							{formatCount(depositStats._count)} deposits ·{' '}
							{formatCount(withdrawalStats._count)} withdrawals
						</span>
					</div>
				</div>

				<div className='mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3'>
					{actions.map((action) => {
						const Icon = action.icon;
						return (
							<Link
								key={action.label}
								href={action.href}
								className='group flex flex-col items-center gap-1.5'
							>
								<span className='flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground sm:h-12 sm:w-12'>
									<Icon className='h-4 w-4 sm:h-5 sm:w-5' />
								</span>
								<span className='text-[11px] font-medium text-muted-foreground group-hover:text-brand'>
									{action.label}
								</span>
							</Link>
						);
					})}
				</div>

				<div className='mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4'>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Users
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatCount(totalUsers)}
						</p>
					</div>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Verified
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatCount(verifiedUsers)}
							<span className='ml-1 text-[10px] font-normal text-muted-foreground sm:text-xs'>
								({verificationRate}%)
							</span>
						</p>
					</div>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Trades
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatCount(totalTrades)}
						</p>
					</div>
				</div>
			</section>

			{/* Review queue */}
			<section className='overflow-hidden rounded-2xl border border-border bg-card'>
				<div className='flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5'>
					<div>
						<h2 className='text-sm font-semibold text-foreground'>
							Review queue
						</h2>
						<p className='mt-0.5 text-xs text-muted-foreground'>
							Pending deposits, withdrawals, and KYC
						</p>
					</div>
				</div>
				<ul className='divide-y divide-border'>
					{queueItems.map((item) => (
						<li key={item.label}>
							<Link
								href={item.href}
								className='flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:px-5'
							>
								<div className='min-w-0'>
									<p className='text-sm font-medium text-foreground'>
										{item.label}
									</p>
									<p className='text-xs text-muted-foreground'>
										{item.tone ? 'Action required' : 'Clear'}
									</p>
								</div>
								<div className='flex shrink-0 items-center gap-3'>
									<span
										className={cn(
											'text-base font-semibold tabular-nums',
											item.tone
												? 'text-amber-600 dark:text-amber-400'
												: 'text-muted-foreground'
										)}
									>
										{item.value}
									</span>
									<span className='text-xs font-medium text-brand'>
										Open
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</section>

			{/* Cash movement */}
			<section className='rounded-2xl border border-border bg-card overflow-hidden'>
				<div className='flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5'>
					<h2 className='text-sm font-semibold text-foreground'>
						Cash movement
					</h2>
					<Link
						href='/admin/dashboard/transactions'
						className='text-xs font-medium text-muted-foreground hover:text-foreground'
					>
						See ledger
					</Link>
				</div>
				<ul className='divide-y divide-border'>
					<li className='flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5'>
						<div className='flex items-center gap-3 min-w-0'>
							<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand'>
								<ArrowDownToLine className='h-4 w-4' />
							</span>
							<div className='min-w-0'>
								<p className='text-sm font-medium text-foreground'>
									Successful deposits
								</p>
								<p className='text-xs text-muted-foreground'>
									{formatCount(depositStats._count)} approved
								</p>
							</div>
						</div>
						<p className='shrink-0 text-sm font-semibold tabular-nums text-brand'>
							{formatMoney(depositVolume)}
						</p>
					</li>
					<li className='flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5'>
						<div className='flex items-center gap-3 min-w-0'>
							<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
								<ArrowUpFromLine className='h-4 w-4' />
							</span>
							<div className='min-w-0'>
								<p className='text-sm font-medium text-foreground'>
									Successful withdrawals
								</p>
								<p className='text-xs text-muted-foreground'>
									{formatCount(withdrawalStats._count)} approved
								</p>
							</div>
						</div>
						<p className='shrink-0 text-sm font-semibold tabular-nums text-foreground'>
							{formatMoney(withdrawalVolume)}
						</p>
					</li>
					<li className='flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5'>
						<div className='flex items-center gap-3 min-w-0'>
							<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
								<ChartCandlestick className='h-4 w-4' strokeWidth={2} />
							</span>
							<div className='min-w-0'>
								<p className='text-sm font-medium text-foreground'>
									Trading activity
								</p>
								<p className='text-xs text-muted-foreground'>
									All recorded trades
								</p>
							</div>
						</div>
						<p className='shrink-0 text-sm font-semibold tabular-nums text-foreground'>
							{formatCount(totalTrades)}
						</p>
					</li>
				</ul>
			</section>

			{/* Recent activity */}
			<section className='rounded-2xl border border-border bg-card overflow-hidden'>
				<div className='flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5'>
					<h2 className='text-sm font-semibold text-foreground'>
						Recent activity
					</h2>
					<Link
						href='/admin/dashboard/transactions'
						className='text-xs font-medium text-muted-foreground hover:text-foreground'
					>
						See all
					</Link>
				</div>
				{recentActivity.length === 0 ? (
					<p className='px-4 py-8 text-center text-sm text-muted-foreground sm:px-5'>
						No transactions yet. Platform activity will appear here.
					</p>
				) : (
					<ul className='divide-y divide-border'>
						{recentActivity.map((item) => (
							<li
								key={item.id}
								className='flex items-center justify-between gap-3 px-4 py-3 sm:px-5'
							>
								<div className='min-w-0'>
									<p className='truncate text-sm font-medium text-foreground'>
										{activityLabel(item)}
										<span className='text-muted-foreground'>
											{' '}
											· {item.user.name}
										</span>
									</p>
									<p className='text-xs text-muted-foreground'>
										{item.createdAt.toLocaleString(undefined, {
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
										<span className='mx-1.5'>·</span>
										<span
											className={cn(
												'capitalize',
												statusTone(item.status)
											)}
										>
											{item.status}
										</span>
									</p>
								</div>
								<p className='shrink-0 text-sm font-semibold tabular-nums text-foreground'>
									{formatMoney(item.amount)}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
};

export default AdminDashboard;
