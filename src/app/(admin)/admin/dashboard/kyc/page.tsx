import {
	Table,
	TableRow,
	TableHeader,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { approveKyc, getKyc, rejectKyc } from '@/actions/Kyc';
import Image from 'next/image';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { revalidatePath } from 'next/cache';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageIcons } from '@/lib/icons/page-icons';
import {
	DashboardEmptyState,
	DashboardPanel,
} from '@/components/dashboard/DashboardPanel';

async function handleApproveKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await approveKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

async function handleRejectKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await rejectKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

const Kyc = async () => {
	const kyc = await getKyc();

	return (
		<div className='space-y-6'>
			<PageHeader
				icon={PageIcons.kyc}
				title='KYC management'
				description='Review identity verification submissions.'
			/>

			{kyc.length === 0 ? (
				<DashboardEmptyState
					title='No KYC submissions'
					description='User verification requests will appear here.'
				/>
			) : (
				<DashboardPanel>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>ID number</TableHead>
									<TableHead>ID type</TableHead>
									<TableHead>Country</TableHead>
									<TableHead>File</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{kyc.map((item) => (
									<TableRow key={item.id}>
										<TableCell className='font-medium'>
											{item.firstName} {item.lastName}
										</TableCell>
										<TableCell>{item.user.email}</TableCell>
										<TableCell>{item.user.phone}</TableCell>
										<TableCell>
											{item.status === 'pending' ? (
												<PendingBadge />
											) : item.status === 'approved' ? (
												<SuccessBadge />
											) : (
												<CancelledBadge />
											)}
										</TableCell>
										<TableCell>{item.idNumber}</TableCell>
										<TableCell>{item.idType}</TableCell>
										<TableCell>{item.country}</TableCell>
										<TableCell>
											{item.idImage &&
											typeof item.idImage === 'string' &&
											(item.idImage.startsWith('http://') ||
												item.idImage.startsWith('https://')) ? (
												<div className='flex items-center gap-2'>
													<Image
														src={item.idImage}
														alt='KYC'
														width={40}
														height={40}
														className='h-10 w-10 rounded-md object-cover'
													/>
													<Link
														href={item.idImage}
														target='_blank'
														rel='noopener noreferrer'
														className='text-sm font-medium text-brand hover:underline'
													>
														View
													</Link>
												</div>
											) : (
												<span className='text-sm text-muted-foreground'>
													—
												</span>
											)}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<form action={handleApproveKyc}>
													<input
														type='hidden'
														name='kycId'
														value={item.id}
													/>
													<Button
														variant='default'
														size='icon'
														type='submit'
													>
														<Check className='h-4 w-4' strokeWidth={2} />
													</Button>
												</form>
												<form action={handleRejectKyc}>
													<input
														type='hidden'
														name='kycId'
														value={item.id}
													/>
													<Button
														variant='destructive'
														size='icon'
														type='submit'
													>
														<X className='h-4 w-4' strokeWidth={2} />
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

export default Kyc;
