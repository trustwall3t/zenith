import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import DepositButton from './DepositButton';
import { getSession } from '@/lib/session';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import { DashboardPanel } from '@/components/dashboard/DashboardPanel';

const Deposit = async () => {
	const methods = [
		{
			id: 1,
			name: 'Bitcoin',
			image: '/dashboard/btc.svg',
			barcode: '/paymentBarcode/Btc.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'BTC',
			address: 'bc1qddjy9jxwzk5pz4m3temhedyuezhg2uh7c23sj0',
			fee: '0.1%',
			description:
				'Bitcoin is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
		{
			id: 2,
			name: 'Ethereum',
			image: '/dashboard/eth.svg',
			barcode: '/paymentBarcode/ETH.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'ERC20',
			address: '0xDba1376b973C65dCB2B3948b707a8d77fc243089',
			fee: '0.1%',
			description:
				'Ethereum is a blockchain-based platform that allows users to create and manage decentralized applications.',
		},
		{
			id: 4,
			name: 'USDT',
			image: '/dashboard/usdt.svg',
			barcode: '/paymentBarcode/usdttrc20.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'TRC20',
			address: 'TU8FiJxn2Ttf68NHXzFsLHP1ptQeBobCQg',
			fee: '0.1%',
			description:
				'USDT is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
		{
			id: 5,
			name: 'Tron',
			image: '/dashboard/trx.svg',
			barcode: '/paymentBarcode/trx.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'TRX',
			address: 'TU8FiJxn2Ttf68NHXzFsLHP1ptQeBobCQg',
			fee: '0.1%',
			description:
				'Tron is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
		{
			id: 6,
			name: 'Solana',
			image: '/dashboard/sol.svg',
			barcode: '/paymentBarcode/sol.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'SOL',
			address: '9QvhpG6zVXH8gwvVKRtfo2SAckd9Dx3MVCpKGoEgr5bq',
			fee: '0.1%',
			description:
				'Solana is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
		{
			id: 7,
			name: 'XRP',
			image: '/dashboard/xrp.svg',
			barcode: '/paymentBarcode/xrp.jpg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000000',
			network: 'XRP',
			address: 'rPiRUygiWN6WhMa3VewnZNhA6mm4YcvRvY',
			fee: '0.1%',
			description:
				'XRP is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
	];
	const session = await getSession();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.deposit}
				title='Deposit'
				description='Fund your account using a supported crypto network.'
			/>

			<div className='flex flex-col lg:flex-row gap-4 w-full items-start'>
				<DashboardPanel className='w-full'>
					<div className='p-5 sm:p-6 space-y-4 '>
						<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
							Available balance
						</p>
						<p className='text-3xl font-semibold tracking-tight tabular-nums text-foreground'>
							$
							{session?.user?.walletBalance
								? session.user.walletBalance.toFixed(2)
								: '0.00'}
						</p>
						<Button asChild variant='outline' size='sm'>
							<Link href='/dashboard/withdraw'>Request withdraw</Link>
						</Button>
					</div>
					<div className='grid grid-cols-2 gap-px border-t border-border bg-border'>
						<div className='bg-card p-4'>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Total deposit
							</p>
							<p className='mt-1 text-sm font-semibold tabular-nums text-foreground'>
								$
								{session?.user?.investmentBalance
									? session.user.investmentBalance.toFixed(2)
									: '0.00'}
							</p>
						</div>
						<div className='bg-card p-4'>
							<p className='text-xs uppercase tracking-wide text-muted-foreground'>
								Trading interest
							</p>
							<p className='mt-1 text-sm font-semibold tabular-nums text-foreground'>
								$
								{session?.user?.profitBalance
									? session.user.profitBalance.toFixed(2)
									: '0.00'}
							</p>
						</div>
					</div>
				</DashboardPanel>

				<DashboardPanel className='p-5 sm:p-6 w-full'>
					<h3 className='text-sm font-semibold text-foreground'>
						Choose payment method
					</h3>
					<ul className='mt-4 divide-y divide-border'>
						{methods.map((method) => (
							<li
								key={`${method.id}-${method.network}`}
								className='flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between'
							>
								<div className='flex items-center gap-3 min-w-0'>
									<Image
										src={method.image}
										alt={method.name}
										width={36}
										height={36}
										className='h-9 w-9 rounded-full'
									/>
									<div className='min-w-0'>
										<p className='font-medium text-foreground'>
											{method.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											{method.network} · {method.processingTime}
										</p>
										<p className='text-xs text-muted-foreground'>
											Min ${method.minDeposit} · Fee {method.fee}
										</p>
									</div>
								</div>
								<DepositButton method={method} />
							</li>
						))}
					</ul>
				</DashboardPanel>
			</div>
		</div>
	);
};

export default Deposit;
