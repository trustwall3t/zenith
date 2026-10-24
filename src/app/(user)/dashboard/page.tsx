import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import DashboardClient from './_components/DashboardClient';
import type { DashboardData } from '@/lib/dashboard';
import { resolveKycStatusLabel } from '@/lib/kyc-status';
import {
	getUserInvestmentPlanViews,
	summarizeActivePlans,
} from '@/lib/investment/user-plans';

function startOfToday() {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}

function activityLabel(tx: {
	transactionType: string;
	type: string;
	postType: string;
}) {
	const raw = (tx.transactionType || tx.type || tx.postType || 'Transaction').toLowerCase();
	if (raw.includes('deposit')) return 'Deposit';
	if (raw.includes('withdraw')) return 'Withdrawal';
	if (raw.includes('profit') || raw === 'roi') return 'ROI / profit';
	if (raw.includes('trad')) return 'Trade';
	if (raw.includes('balance')) return 'Balance update';
	if (raw.includes('target')) return 'Target update';
	if (raw.includes('kyc')) return 'KYC update';
	return tx.type || tx.transactionType || 'Transaction';
}

const DashboardPage = async () => {
	const session = await getSession();
	if (!session) {
		redirect('/auth/login');
	}

	const user = await db.user.findUnique({
		where: { id: session.userId },
		include: {
			kyc: {
				orderBy: { createdAt: 'desc' },
				select: { status: true },
			},
		},
	});

	if (!user) {
		redirect('/auth/login');
	}

	const today = startOfToday();

	const [recentTx, pendingAgg, todayProfitAgg, activeTrades, planViews] =
		await Promise.all([
			db.transaction.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: 'desc' },
				take: 5,
				select: {
					id: true,
					amount: true,
					status: true,
					transactionType: true,
					type: true,
					postType: true,
					createdAt: true,
				},
			}),
			db.transaction.aggregate({
				where: {
					userId: user.id,
					status: 'pending',
					OR: [
						{ transactionType: { contains: 'deposit', mode: 'insensitive' } },
						{ transactionType: { contains: 'withdraw', mode: 'insensitive' } },
						{ type: { contains: 'deposit', mode: 'insensitive' } },
						{ type: { contains: 'withdraw', mode: 'insensitive' } },
					],
				},
				_sum: { amount: true },
			}),
			db.transaction.aggregate({
				where: {
					userId: user.id,
					status: 'success',
					createdAt: { gte: today },
					OR: [
						{ transactionType: { contains: 'profit', mode: 'insensitive' } },
						{ transactionType: { equals: 'ROI', mode: 'insensitive' } },
						{ type: { contains: 'profit', mode: 'insensitive' } },
						{ type: { equals: 'ROI', mode: 'insensitive' } },
						{ paymentMethod: { contains: 'profit', mode: 'insensitive' } },
					],
				},
				_sum: { amount: true },
			}),
			db.copyTrade.count({
				where: {
					userId: user.id,
					status: 'open',
				},
			}),
			getUserInvestmentPlanViews(user.id),
		]);

	const planSummary = summarizeActivePlans(planViews);
	const activeInvestmentPlans = planViews
		.filter((p) => p.isActive)
		.slice(0, 3)
		.map((p) => ({
			id: p.id,
			planName: p.planName,
			amount: p.amount,
			profitEarned: p.profitEarned,
			incrementLabel: p.incrementLabel,
			nextPayoutAt: p.nextPayoutAt,
		}));

	const kycStatus = resolveKycStatusLabel(user);

	const data: DashboardData = {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			walletBalance: user.walletBalance ?? 0,
			investmentBalance: user.investmentBalance ?? 0,
			profitBalance: user.profitBalance ?? 0,
			roiTotal: user.roiTotal ?? 0,
			isVerified: user.isVerified,
			btcAddress: user.btcAddress,
			ethAddress: user.ethAddress,
			usdtAddress: user.usdtAddress,
		},
		kycStatus,
		pendingAmount: pendingAgg._sum.amount ?? 0,
		todayPnl: todayProfitAgg._sum.amount ?? 0,
		activeTrades,
		activeInvestmentPlans,
		planPrincipalTotal: planSummary.principal,
		planProfitEarnedTotal: planSummary.profitEarned,
		recentActivity: recentTx.map((tx) => ({
			id: tx.id,
			label: activityLabel(tx),
			amount: tx.amount,
			status: tx.status,
			transactionType: tx.transactionType,
			createdAt: tx.createdAt.toISOString(),
		})),
	};

	return <DashboardClient data={data} />;
};

export default DashboardPage;
