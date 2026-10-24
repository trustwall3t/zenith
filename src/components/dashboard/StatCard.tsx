import { cn } from '@/lib/utils';

interface StatCardProps {
	label: string;
	value: React.ReactNode;
	hint?: React.ReactNode;
	icon?: React.ReactNode;
	className?: string;
	children?: React.ReactNode;
}

export function StatCard({
	label,
	value,
	hint,
	icon,
	className,
	children,
}: StatCardProps) {
	return (
		<div
			className={cn(
				'rounded-lg border border-border bg-card text-card-foreground p-5 flex flex-col gap-3',
				className
			)}
		>
			<div className='flex items-start justify-between gap-3'>
				<p className='text-sm font-medium text-muted-foreground'>
					{label}
				</p>
				{icon ? (
					<span className='text-brand shrink-0'>{icon}</span>
				) : null}
			</div>
			<div className='text-2xl font-semibold tracking-tight tabular-nums'>
				{value}
			</div>
			{hint ? (
				<div className='text-xs text-muted-foreground'>{hint}</div>
			) : null}
			{children}
		</div>
	);
}
