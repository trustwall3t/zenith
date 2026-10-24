import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AllTransactions from './AllTransactions';
import DepositHistory from './DepositHistory';
import WithdrawalHistory from './WithdrawalHistory';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';

const TransactionHistory = () => {
	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.transactions}
				title='Transaction history'
				description='Review deposits, withdrawals, and account activity.'
			/>
			<Tabs className='w-full' defaultValue='transaction'>
				<TabsList>
					<TabsTrigger value='transaction'>All</TabsTrigger>
					<TabsTrigger value='deposit'>Deposits</TabsTrigger>
					<TabsTrigger value='withdraw'>Withdrawals</TabsTrigger>
				</TabsList>

				<TabsContent value='transaction' className='w-full mt-4'>
					<AllTransactions />
				</TabsContent>
				<TabsContent value='deposit' className='w-full mt-4'>
					<DepositHistory />
				</TabsContent>
				<TabsContent value='withdraw' className='w-full mt-4'>
					<WithdrawalHistory />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransactionHistory;
