import TradeForm from '@/app/(admin)/components/form/TradeForm';
import BalanceForm from '@/app/(admin)/components/form/BalanceForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAllUsers } from '../../../../../actions/admin/users';
import UserSelect from '@/app/(admin)/components/UserSelect';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
	profitBalance?: number | null;
	investmentBalance?: number | null;
};

export default async function LiveTrade({
	searchParams,
}: {
	searchParams: Promise<{ userId?: string }>;
}) {
	const users = await getAllUsers();
	const params = await searchParams;
	const selectedUser: UserData | null = params.userId
		? users.find((user) => user.id === params.userId) || null
		: null;

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.adminLive}
				title='Live trading'
				description='Adjust balances or place trades for a selected user.'
			/>

			<DashboardPanel className='p-4 sm:p-6'>
				<div className='flex flex-col gap-6 md:flex-row md:items-start'>
					<div className='w-full md:w-1/3'>
						<UserSelect
							users={users}
							defaultUserId={selectedUser?.id}
						/>
					</div>
					<div className='w-full md:w-2/3'>
						<Tabs defaultValue='trade'>
							<TabsList className='w-full'>
								<TabsTrigger value='balance' className='flex-1'>
									Balance
								</TabsTrigger>
								<TabsTrigger value='trade' className='flex-1'>
									Trade
								</TabsTrigger>
							</TabsList>
							<TabsContent value='balance' className='mt-4'>
								<BalanceForm user={selectedUser} />
							</TabsContent>
							<TabsContent value='trade' className='mt-4'>
								<TradeForm user={selectedUser} />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</DashboardPanel>
		</div>
	);
}
