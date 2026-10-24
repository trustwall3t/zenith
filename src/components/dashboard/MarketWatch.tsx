'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
	Activity,
	RefreshCw,
	TrendingDown,
	TrendingUp,
	Minus,
} from 'lucide-react';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { MarketAsset } from '@/lib/market';
import { MarketSparkline } from '@/components/dashboard/MarketSparkline';

type MarketType = 'crypto' | 'stocks';

const REFRESH_MS = 30_000;

function formatPrice(price: number) {
	if (price >= 1000) {
		return `$${price.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	}
	if (price >= 1) {
		return `$${price.toFixed(2)}`;
	}
	return `$${price.toPrecision(4)}`;
}

function formatChange(value: number) {
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
}

function TrendBadge({ changePercent }: { changePercent: number }) {
	const isUp = changePercent > 0;
	const isFlat = Math.abs(changePercent) < 0.005;

	if (isFlat) {
		return (
			<span className='inline-flex items-center justify-end gap-1 text-muted-foreground tabular-nums text-xs font-medium'>
				<Minus className='h-3.5 w-3.5' strokeWidth={2} />
				{formatChange(0)}
			</span>
		);
	}

	return (
		<span
			className={cn(
				'inline-flex items-center justify-end gap-1 text-xs font-semibold tabular-nums',
				isUp ? 'text-brand' : 'text-red-600 dark:text-red-400',
			)}
		>
			{isUp ? (
				<TrendingUp className='h-3.5 w-3.5' strokeWidth={2} />
			) : (
				<TrendingDown className='h-3.5 w-3.5' strokeWidth={2} />
			)}
			{formatChange(changePercent)}
		</span>
	);
}

function AssetLogo({
	image,
	symbol,
}: {
	image?: string;
	symbol: string;
}) {
	const [failed, setFailed] = useState(false);

	if (!image || failed) {
		return (
			<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-1 ring-border/60'>
				{symbol.slice(0, 2)}
			</div>
		);
	}

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={image}
			alt=''
			width={36}
			height={36}
			className='h-9 w-9 shrink-0 rounded-full object-cover bg-muted ring-1 ring-border/40'
			onError={() => setFailed(true)}
		/>
	);
}

function MarketRow({
	asset,
	changeLabel,
	rowHref,
}: {
	asset: MarketAsset;
	changeLabel: string;
	rowHref?: string;
}) {
	const isUp = asset.changePercent >= 0;
	const gradId = asset.id.replace(/[^a-zA-Z0-9_-]/g, '') || asset.symbol;

	const body = (
		<>
			{/* Mobile */}
			<div className='space-y-3 sm:hidden'>
				<div className='flex items-center gap-3'>
					<AssetLogo image={asset.image} symbol={asset.symbol} />
					<div className='min-w-0 flex-1'>
						<p className='font-semibold text-foreground truncate text-sm'>
							{asset.name}
						</p>
						<p className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground'>
							{asset.symbol}
						</p>
					</div>
					<div className='shrink-0 text-right'>
						<p className='font-semibold tabular-nums text-foreground text-sm'>
							{formatPrice(asset.price)}
						</p>
						<TrendBadge changePercent={asset.changePercent} />
					</div>
				</div>
				<MarketSparkline
					data={asset.sparkline}
					positive={isUp}
					gradientId={`m-${gradId}`}
					className='max-w-none h-12'
				/>
				<p className='text-[10px] text-muted-foreground'>{changeLabel}</p>
			</div>
			{/* Desktop */}
			<div className='hidden sm:grid sm:grid-cols-[minmax(0,1fr)_140px_108px] sm:items-center sm:gap-4'>
				<div className='flex min-w-0 items-center gap-3'>
					<AssetLogo image={asset.image} symbol={asset.symbol} />
					<div className='min-w-0'>
						<p className='font-semibold text-foreground truncate text-sm'>
							{asset.name}
						</p>
						<p className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground'>
							{asset.symbol}
						</p>
					</div>
				</div>
				<MarketSparkline
					data={asset.sparkline}
					positive={isUp}
					gradientId={gradId}
				/>
				<div className='text-right'>
					<p className='font-semibold tabular-nums text-foreground text-sm'>
						{formatPrice(asset.price)}
					</p>
					<div className='mt-1 flex flex-col items-end gap-0.5'>
						<TrendBadge changePercent={asset.changePercent} />
						<p className='text-[10px] text-muted-foreground'>{changeLabel}</p>
					</div>
				</div>
			</div>
		</>
	);

	const rowClass =
		'block border-b border-border/50 last:border-0 px-4 py-4 transition-colors hover:bg-muted/35';

	if (rowHref) {
		return (
			<Link href={rowHref} className={rowClass}>
				{body}
			</Link>
		);
	}

	return <div className={rowClass}>{body}</div>;
}

function MarketListHeader({ trendLabel }: { trendLabel: string }) {
	return (
		<div className='hidden sm:grid sm:grid-cols-[1fr_140px_100px] gap-3 sticky top-0 z-10 border-b border-border bg-muted/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
			<span>Asset & trend</span>
			<span className='text-center'>{trendLabel}</span>
			<span className='text-right'>Price / change</span>
		</div>
	);
}

function MarketList({
	assets,
	loading,
	error,
	changeLabel,
	trendLabel,
	rowHref,
}: {
	assets: MarketAsset[];
	loading: boolean;
	error: string | null;
	changeLabel: string;
	trendLabel: string;
	rowHref?: string;
}) {
	if (loading && assets.length === 0) {
		return (
			<div className='divide-y divide-border/50'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className='flex gap-4 px-4 py-4'>
						<div className='h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted' />
						<div className='flex-1 space-y-2'>
							<div className='h-3 w-32 animate-pulse rounded bg-muted' />
							<div className='h-8 w-full max-w-[140px] animate-pulse rounded-md bg-muted' />
						</div>
						<div className='h-4 w-16 animate-pulse rounded bg-muted' />
					</div>
				))}
			</div>
		);
	}

	if (error && assets.length === 0) {
		return (
			<p className='p-8 text-sm text-muted-foreground text-center'>{error}</p>
		);
	}

	return (
		<div>
			<MarketListHeader trendLabel={trendLabel} />
			<div className='divide-y divide-border/40'>
				{assets.map((asset) => (
					<MarketRow
						key={asset.id}
						asset={asset}
						changeLabel={changeLabel}
						rowHref={rowHref}
					/>
				))}
			</div>
		</div>
	);
}

type MarketWatchProps = {
	previewLimit?: number;
	rowHref?: string;
};

export function MarketWatch({
	previewLimit,
	rowHref,
}: MarketWatchProps = {}) {
	const [tab, setTab] = useState<MarketType>('crypto');
	const [crypto, setCrypto] = useState<MarketAsset[]>([]);
	const [stocks, setStocks] = useState<MarketAsset[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState<string | null>(null);
	const [expanded, setExpanded] = useState(false);

	const load = useCallback(async (type: MarketType, silent = false) => {
		if (!silent) setLoading(true);
		else setRefreshing(true);
		setError(null);
		try {
			const res = await fetch(`/api/market/quotes?type=${type}`, {
				cache: 'no-store',
			});
			if (!res.ok) {
				throw new Error('Could not load market data');
			}
			const data = (await res.json()) as {
				assets: MarketAsset[];
				updatedAt: string;
			};
			if (type === 'crypto') {
				setCrypto(data.assets);
			} else {
				setStocks(data.assets);
			}
			setUpdatedAt(data.updatedAt);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Could not load market data',
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		void load(tab);
		const id = setInterval(() => {
			void load(tab, true);
		}, REFRESH_MS);
		return () => clearInterval(id);
	}, [tab, load]);

	useEffect(() => {
		const other: MarketType = tab === 'crypto' ? 'stocks' : 'crypto';
		const hasOther = other === 'crypto' ? crypto.length : stocks.length;
		if (hasOther === 0) {
			void load(other, true);
		}
	}, [tab, crypto.length, stocks.length, load]);

	const limit = previewLimit && !expanded ? previewLimit : undefined;
	const cryptoShown = limit ? crypto.slice(0, limit) : crypto;
	const stocksShown = limit ? stocks.slice(0, limit) : stocks;
	const fullCount = tab === 'crypto' ? crypto.length : stocks.length;
	const canExpand = Boolean(previewLimit && fullCount > previewLimit);

	return (
		<section className='w-full space-y-4'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div className='flex items-start gap-3'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10'>
						<Activity className='h-5 w-5' strokeWidth={2} />
					</div>
					<div>
						<p className='font-semibold text-foreground'>Markets</p>
						<p className='text-xs text-muted-foreground mt-0.5'>
							Live quotes with recent price movement · updates every 30s
							{updatedAt
								? ` · ${new Date(updatedAt).toLocaleTimeString()}`
								: ''}
						</p>
					</div>
				</div>
				<button
					type='button'
					onClick={() => void load(tab, true)}
					disabled={loading || refreshing}
					className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50'
				>
					<RefreshCw
						className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')}
						strokeWidth={2}
					/>
					Refresh
				</button>
			</div>

			<Tabs
				value={tab}
				onValueChange={(value) => {
					setTab(value as MarketType);
					setExpanded(false);
				}}
				className='w-full'
			>
				<TabsList className='grid w-full max-w-xs grid-cols-2'>
					<TabsTrigger value='crypto'>Crypto</TabsTrigger>
					<TabsTrigger value='stocks'>Stocks</TabsTrigger>
				</TabsList>
				<TabsContent value='crypto' className='mt-3'>
					<div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
						<MarketList
							assets={cryptoShown}
							loading={loading && tab === 'crypto' && crypto.length === 0}
							error={error}
							changeLabel='24h'
							trendLabel='7d trend'
							rowHref={rowHref}
						/>
					</div>
				</TabsContent>
				<TabsContent value='stocks' className='mt-3'>
					<div className='overflow-hidden rounded-2xl border border-border bg-card shadow-sm'>
						<MarketList
							assets={stocksShown}
							loading={loading && tab === 'stocks' && stocks.length === 0}
							error={error}
							changeLabel='Today'
							trendLabel='5d trend'
							rowHref={rowHref}
						/>
					</div>
				</TabsContent>
			</Tabs>

			{canExpand ? (
				<div className='flex justify-center'>
					<button
						type='button'
						onClick={() => setExpanded((v) => !v)}
						className='text-xs font-medium text-brand hover:underline'
					>
						{expanded ? 'Show less' : `View all markets (${fullCount})`}
					</button>
				</div>
			) : null}
		</section>
	);
}
