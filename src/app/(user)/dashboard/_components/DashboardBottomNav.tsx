"use client";

import type { ComponentType } from "react";
import {
	Activity,
	ArrowDownToLine,
	Copy,
	LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type BottomNavItem = {
	label: string;
	shortLabel?: string;
	href: string;
	icon: ComponentType<{ className?: string; strokeWidth?: number }>;
	exact?: boolean;
};

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		exact: true,
	},
	{
		label: "Live trading",
		shortLabel: "Live",
		href: "/dashboard/live-trading",
		icon: Activity,
	},
	{
		label: "Copy trading",
		shortLabel: "Copy",
		href: "/dashboard/copy",
		icon: Copy,
	},
	{
		label: "Deposit",
		href: "/dashboard/deposit",
		icon: ArrowDownToLine,
	},
];

function isActive(pathname: string, href: string, exact?: boolean) {
	if (exact) return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardBottomNav() {
	const pathname = usePathname();

	return (
		<div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden'>
			<nav
				className='pointer-events-auto mx-auto max-w-lg rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/90'
				aria-label='Primary dashboard navigation'
			>
				<ul className='grid grid-cols-4 gap-0 px-1 py-1.5'>
				{BOTTOM_NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const active = isActive(pathname, item.href, item.exact);
					return (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									"flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors",
									active
										? "text-brand"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon
									className={cn(
										"h-5 w-5",
										active ? "text-brand" : "text-muted-foreground",
									)}
									strokeWidth={active ? 2.25 : 2}
								/>
								<span className='truncate max-w-full'>
									{item.shortLabel ?? item.label}
								</span>
							</Link>
						</li>
					);
				})}
				</ul>
			</nav>
		</div>
	);
}
