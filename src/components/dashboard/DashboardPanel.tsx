import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function DashboardPanel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'rounded-2xl border border-border bg-card text-card-foreground overflow-hidden',
				className
			)}
		>
			{children}
		</div>
	);
}

export function DashboardEmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className='flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center'>
			<p className='text-base font-semibold text-foreground'>{title}</p>
			{description ? (
				<p className='text-sm text-muted-foreground max-w-sm'>
					{description}
				</p>
			) : null}
			{action ? <div className='mt-3'>{action}</div> : null}
		</div>
	);
}

