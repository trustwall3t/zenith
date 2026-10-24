'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
	ArrowDownToLine,
	ArrowUpFromLine,
	BadgeCheck,
	ChartCandlestick,
	CircleAlert,
	ReceiptText,
	ShieldCheck,
	Wallet,
} from 'lucide-react';
import type { DashboardData } from '@/lib/dashboard';
import {
	isKycApprovedStatus,
	isKycPendingStatus,
	resolveKycDisplayState,
} from '@/lib/kyc-status';
import { MarketWatch } from '@/components/dashboard/MarketWatch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
	data: DashboardData;
}

function formatMoney(value: number) {
	return `$${value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function formatSignedMoney(value: number) {
	const formatted = formatMoney(Math.abs(value));
	if (value > 0) return `+${formatted}`;
	if (value < 0) return `-${formatted}`;
	return formatted;
}

function statusTone(status: string) {
	const s = status.toLowerCase();
	if (s === 'success' || s === 'approved') {
		return 'text-brand';
	}
	if (s === 'pending') {
		return 'text-amber-600 dark:text-amber-400';
	}
	if (s === 'cancelled' || s === 'rejected' || s === 'failed') {
		return 'text-red-600 dark:text-red-400';
	}
	return 'text-muted-foreground';
}

const DashboardClient = ({ data }: DashboardClientProps) => {
	const {
		user,
		kycStatus,
		pendingAmount,
		todayPnl,
		activeTrades,
		activeInvestmentPlans,
		planPrincipalTotal,
		planProfitEarnedTotal,
		recentActivity,
	} = data;

	const totalPnl = user.profitBalance;
	const walletsReady = Boolean(
		user.btcAddress || user.ethAddress || user.usdtAddress
	);
	const kycReady =
		resolveKycDisplayState({
			isVerified: user.isVerified,
			kyc: [{ status: kycStatus }],
		}) === 'complete';

	const actions = [
		{ label: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
		{ label: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
		{ label: 'Trade', href: '/dashboard/live-trading', icon: ChartCandlestick },
		{
			label: 'History',
			href: '/dashboard/transaction-history',
			icon: ReceiptText,
		},
	] as const;

	return (
		<div className='flex flex-col gap-5 w-full'>
			{/* Header */}
			<div className='flex items-center justify-between gap-3'>
				<div className='min-w-0'>
					<p className='text-sm text-muted-foreground'>Welcome back</p>
					<h1 className='text-lg font-semibold tracking-tight text-foreground truncate'>
						{user.name.split(' ')[0]}
					</h1>
				</div>
				{kycReady ? (
					<span className='inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand'>
						<span className='h-1.5 w-1.5 rounded-full bg-brand' />
						Verified
					</span>
				) : (
					<Link
						href='/dashboard/kyc'
						className='inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400'
					>
						Complete KYC
					</Link>
				)}
			</div>

			{/* Portfolio hero */}
			<section className='rounded-2xl border border-border bg-card px-4 py-5 sm:px-6 sm:py-6'>
				<div className='flex flex-col items-center text-center'>
					<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Available balance
					</p>
					<p className='mt-1.5 text-[2rem] leading-none font-semibold tracking-tight tabular-nums text-foreground sm:text-4xl'>
						{formatMoney(user.walletBalance)}
					</p>
					<div className='mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs'>
						<span
							className={cn(
								'font-medium tabular-nums',
								todayPnl > 0
									? 'text-brand'
									: todayPnl < 0
										? 'text-red-600 dark:text-red-400'
										: 'text-muted-foreground'
							)}
						>
							Today {formatSignedMoney(todayPnl)}
						</span>
						<span className='text-border'>·</span>
						<span
							className={cn(
								'font-medium tabular-nums',
								totalPnl > 0
									? 'text-brand'
									: totalPnl < 0
										? 'text-red-600 dark:text-red-400'
										: 'text-muted-foreground'
							)}
						>
							All-time P&L {formatSignedMoney(totalPnl)}
						</span>
					</div>
				</div>

				<div className='mt-5 grid grid-cols-4 gap-2 sm:gap-3'>
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

				{/* Available / invested / pending */}
				<div className='mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4'>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Available
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatMoney(user.walletBalance)}
						</p>
					</div>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Invested
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatMoney(user.investmentBalance)}
						</p>
					</div>
					<div className='rounded-xl bg-muted/50 px-2.5 py-3 text-center sm:px-3'>
						<p className='text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs'>
							Pending
						</p>
						<p className='mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base'>
							{formatMoney(pendingAmount)}
						</p>
					</div>
				</div>
			</section>

			{/* Investment plans & trades */}
			<section className='rounded-2xl border border-border bg-card p-4 sm:p-5'>
				<div className='flex items-center justify-between gap-3'>
					<div>
						<h2 className='text-sm font-semibold text-foreground'>
							Investment plans & trades
						</h2>
						<p className='text-xs text-muted-foreground mt-0.5'>
							{activeInvestmentPlans.length > 0
								? `${activeInvestmentPlans.length} active plan${activeInvestmentPlans.length === 1 ? '' : 's'} · ${formatMoney(planPrincipalTotal)} principal · ${formatMoney(planProfitEarnedTotal)} ROI earned`
								: activeTrades > 0
									? `${activeTrades} open trade${activeTrades === 1 ? '' : 's'}`
									: 'No active plans or open trades'}
						</p>
					</div>
					<Button asChild variant='outline' size='sm'>
						<Link href='/dashboard/plans'>My plans</Link>
					</Button>
				</div>
				{activeInvestmentPlans.length > 0 ? (
					<ul className='mt-4 space-y-2'>
						{activeInvestmentPlans.map((plan) => (
							<li
								key={plan.id}
								className='flex flex-col gap-1 rounded-xl border border-border bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between'
							>
								<div>
									<p className='text-sm font-medium'>{plan.planName}</p>
									<p className='text-xs text-muted-foreground'>
										{plan.incrementLabel} · Next ROI{' '}
										{new Date(plan.nextPayoutAt).toLocaleString(undefined, {
											dateStyle: 'short',
											timeStyle: 'short',
										})}
									</p>
								</div>
								<div className='text-sm tabular-nums sm:text-right'>
									<p>{formatMoney(plan.amount)}</p>
									<p className='text-xs text-emerald-600 dark:text-emerald-400'>
										+{formatMoney(plan.profitEarned)} earned
									</p>
								</div>
							</li>
						))}
					</ul>
				) : null}
				{activeInvestmentPlans.length === 0 && activeTrades === 0 ? (
					<div className='mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5 text-center'>
						<p className='text-sm text-muted-foreground'>
							Join an investment plan to track ROI, or use live trading for
							self-trades.
						</p>
						<div className='mt-3 flex flex-wrap justify-center gap-2'>
							<Button asChild size='sm'>
								<Link href='/dashboard/plans'>View plans</Link>
							</Button>
							<Button asChild size='sm' variant='outline'>
								<Link href='/dashboard/live-trading'>Live trading</Link>
							</Button>
						</div>
					</div>
				) : null}
				{activeTrades > 0 ? (
					<p className='mt-3 text-xs text-muted-foreground'>
						{activeTrades} self/copy trade{activeTrades === 1 ? '' : 's'} open —{' '}
						<Link href='/dashboard/trading-history' className='text-brand hover:underline'>
							trading history
						</Link>
					</p>
				) : null}
			</section>

			{/* Recent activity */}
			<section className='rounded-2xl border border-border bg-card overflow-hidden'>
				<div className='flex items-center justify-between gap-3 px-4 py-3 sm:px-5 border-b border-border'>
					<h2 className='text-sm font-semibold text-foreground'>
						Recent activity
					</h2>
					<Link
						href='/dashboard/transaction-history'
						className='text-xs font-medium text-muted-foreground hover:text-foreground'
					>
						See all
					</Link>
				</div>
				{recentActivity.length === 0 ? (
					<p className='px-4 py-8 text-center text-sm text-muted-foreground sm:px-5'>
						No transactions yet. Your deposits, withdrawals, and trades will
						appear here.
					</p>
				) : (
					<ul className='divide-y divide-border'>
						{recentActivity.map((item) => (
							<li
								key={item.id}
								className='flex items-center justify-between gap-3 px-4 py-3 sm:px-5'
							>
								<div className='min-w-0'>
									<p className='text-sm font-medium text-foreground truncate'>
										{item.label}
									</p>
									<p className='text-xs text-muted-foreground'>
										{new Date(item.createdAt).toLocaleString(undefined, {
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
										<span className='mx-1.5'>·</span>
										<span className={cn('capitalize', statusTone(item.status))}>
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

			{/* Markets */}
			<MarketWatch previewLimit={8} rowHref='/dashboard/live-trading' />

			{/* Account health */}
			<section className='rounded-2xl border border-border bg-card p-4 sm:p-5'>
				<h2 className='text-sm font-semibold text-foreground mb-3'>
					Account health
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
					<HealthItem
						icon={ShieldCheck}
						label='KYC'
						value={
							kycReady
								? 'Verified'
								: isKycPendingStatus(kycStatus)
									? 'Pending'
									: 'Required'
						}
						ok={kycReady}
						href='/dashboard/kyc'
					/>
					<HealthItem
						icon={Wallet}
						label='Withdrawal wallets'
						value={walletsReady ? 'Set' : 'Missing'}
						ok={walletsReady}
						href='/dashboard/settings'
					/>
					<HealthItem
						icon={BadgeCheck}
						label='Security'
						value='Review settings'
						ok={true}
						href='/dashboard/settings'
					/>
				</div>
			</section>
		</div>
	);
};

function HealthItem({
	icon: Icon,
	label,
	value,
	ok,
	href,
}: {
	icon: ComponentType<{ className?: string }>;
	label: string;
	value: string;
	ok: boolean;
	href: string;
}) {
	return (
		<Link
			href={href}
			className='flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-3 hover:bg-muted/70 transition-colors'
		>
			<span
				className={cn(
					'flex h-9 w-9 items-center justify-center rounded-full',
					ok
						? 'bg-brand-soft text-brand'
						: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
				)}
			>
				{ok ? (
					<Icon className='h-4 w-4' />
				) : (
					<CircleAlert className='h-4 w-4' />
				)}
			</span>
			<div className='min-w-0'>
				<p className='text-xs text-muted-foreground'>{label}</p>
				<p className='text-sm font-medium text-foreground truncate'>{value}</p>
			</div>
		</Link>
	);
}

export default DashboardClient;
