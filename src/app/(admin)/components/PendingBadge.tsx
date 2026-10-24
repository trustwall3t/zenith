import { Clock } from 'lucide-react';

const PendingBadge = () => {
	return (
		<span className='inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400'>
			<span className='flex h-4 w-4 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/15'>
				<Clock className='h-3 w-3' strokeWidth={2} />
			</span>
			<span className='text-sm font-medium capitalize'>pending</span>
		</span>
	);
};

export default PendingBadge;
