import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
	actions?: ReactNode;
	icon?: LucideIcon;
}

export function PageHeader({
	title,
	description,
	className,
	actions,
	icon: Icon,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6',
				className
			)}
		>
			<div className='flex min-w-0 items-start gap-3'>
				{Icon ? (
					<div
						className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand shadow-sm ring-1 ring-brand/10'
						aria-hidden
					>
						<Icon className='h-5 w-5' strokeWidth={2} />
					</div>
				) : null}
				<div className='min-w-0 space-y-1'>
					<h1 className='text-2xl font-semibold tracking-tight text-foreground'>
						{title}
					</h1>
					{description ? (
						<p className='text-sm text-muted-foreground max-w-xl'>
							{description}
						</p>
					) : null}
				</div>
			</div>
			{actions ? <div className='mt-0 sm:mb-0.5 shrink-0'>{actions}</div> : null}
		</div>
	);
}
