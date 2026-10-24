export type DashboardActivity = {
	id: string;
	label: string;
	amount: number;
	status: string;
	transactionType: string;
	createdAt: string;
};

export type DashboardInvestmentPlan = {
	id: string;
	planName: string;
	amount: number;
	profitEarned: number;
	incrementLabel: string;
	nextPayoutAt: string;
};

export type DashboardData = {
	user: {
		id: string;
		name: string;
		email: string;
		walletBalance: number;
		investmentBalance: number;
		profitBalance: number;
		roiTotal: number;
		isVerified: boolean;
		btcAddress: string | null;
		ethAddress: string | null;
		usdtAddress: string | null;
	};
	kycStatus: 'none' | 'pending' | 'approved' | 'rejected' | string;
	pendingAmount: number;
	todayPnl: number;
	activeTrades: number;
	activeInvestmentPlans: DashboardInvestmentPlan[];
	planPrincipalTotal: number;
	planProfitEarnedTotal: number;
	recentActivity: DashboardActivity[];
};
