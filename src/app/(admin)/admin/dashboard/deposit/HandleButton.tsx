import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX, Trash2 } from 'lucide-react';
import {
	approveDepositRequest,
	deleteDepositRequest,
	rejectDepositRequest,
} from '@/actions/admin/getDepositRequest';

export default function HandleButton({
	depositId,
	userId,
}: {
	depositId: string;
	userId: string;
}) {
	return (
		<div className='flex gap-2'>
			<form
				action={async () => {
					'use server';
					await approveDepositRequest(depositId, userId);
				}}
			>
				<Button type='submit' size='icon' variant='default'>
					<CircleCheck className='h-4 w-4' strokeWidth={2} />
				</Button>
			</form>
			<form
				action={async () => {
					'use server';
					await rejectDepositRequest(depositId);
				}}
			>
				<Button type='submit' size='icon' variant='secondary'>
					<CircleX className='h-4 w-4' strokeWidth={2} />
				</Button>
			</form>
			<form
				action={async () => {
					'use server';
					await deleteDepositRequest(depositId);
				}}
			>
				<Button type='submit' size='icon' variant='destructive'>
					<Trash2 className='h-4 w-4' strokeWidth={2} />
				</Button>
			</form>
		</div>
	);
}
