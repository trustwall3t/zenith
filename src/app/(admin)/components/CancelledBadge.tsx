import { CircleX } from 'lucide-react';

const CancelledBadge = () => {
	return (
		<span className='inline-flex items-center gap-1.5 text-destructive'>
			<span className='flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white'>
				<CircleX className='h-3.5 w-3.5' strokeWidth={2} />
			</span>
			<span className='text-sm font-medium capitalize'>cancelled</span>
		</span>
	);
};

export default CancelledBadge;
