import { CircleCheck } from 'lucide-react';

const SuccessBadge = () => {
	return (
		<span className='inline-flex items-center gap-1.5 text-brand'>
			<span className='flex h-4 w-4 items-center justify-center rounded-full bg-brand text-brand-foreground'>
				<CircleCheck className='h-3.5 w-3.5' strokeWidth={2} />
			</span>
			<span className='text-sm font-medium capitalize'>approved</span>
		</span>
	);
};

export default SuccessBadge;
