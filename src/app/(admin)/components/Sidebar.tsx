'use client';

import type { ComponentType } from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar';
import {
	Activity,
	ArrowDownToLine,
	ArrowUpFromLine,
	LayoutDashboard,
	LineChart,
	LogOut,
	ReceiptText,
	Settings2,
	ShieldCheck,
	TrendingUp,
	UserCog,
	Users,
} from 'lucide-react';
import { ThemeLogo } from '@/components/brand/ThemeLogo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { logoutAdmin } from '@/actions/auth/admin';
import { cn } from '@/lib/utils';

type NavItem = {
	label: string;
	icon: ComponentType<{ className?: string; strokeWidth?: number }>;
	href: string;
	exact?: boolean;
};

const overviewItems: NavItem[] = [
	{
		label: 'Overview',
		icon: LayoutDashboard,
		href: '/admin/dashboard',
		exact: true,
	},
];

const moneyItems: NavItem[] = [
	{
		label: 'Investment plans',
		icon: TrendingUp,
		href: '/admin/dashboard/plans',
	},
	{
		label: 'Transactions',
		icon: ReceiptText,
		href: '/admin/dashboard/transactions',
	},
	{
		label: 'Deposits',
		icon: ArrowDownToLine,
		href: '/admin/dashboard/deposit',
	},
	{
		label: 'Withdrawals',
		icon: ArrowUpFromLine,
		href: '/admin/dashboard/withdrawal',
	},
];

const tradingItems: NavItem[] = [
	{
		label: 'Copy traders',
		icon: UserCog,
		href: '/admin/dashboard/copy-traders',
	},
	{
		label: 'Trade history',
		icon: LineChart,
		href: '/admin/dashboard/trade',
	},
	{
		label: 'Live trading',
		icon: Activity,
		href: '/admin/dashboard/livetrade',
	},
];

const peopleItems: NavItem[] = [
	{
		label: 'Users',
		icon: Users,
		href: '/admin/dashboard/users',
	},
	{
		label: 'KYC',
		icon: ShieldCheck,
		href: '/admin/dashboard/kyc',
	},
	{
		label: 'Settings',
		icon: Settings2,
		href: '/admin/dashboard/settings',
	},
];

function isActive(pathname: string, href: string, exact?: boolean) {
	if (exact) return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

function NavGroup({
	label,
	items,
	pathname,
	onNavigate,
}: {
	label: string;
	items: NavItem[];
	pathname: string;
	onNavigate?: () => void;
}) {
	return (
		<SidebarGroup className='px-2 py-1'>
			<SidebarGroupLabel className='px-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80'>
				{label}
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu className='gap-0.5'>
					{items.map((item) => {
						const Icon = item.icon;
						const active = isActive(pathname, item.href, item.exact);
						return (
							<SidebarMenuItem key={item.label}>
								<SidebarMenuButton
									asChild
									tooltip={item.label}
									isActive={active}
									className={cn(
										'h-10 rounded-xl px-2.5 transition-colors',
										'text-sidebar-foreground/80 hover:bg-brand-soft hover:text-brand',
										active &&
											'bg-brand-soft text-brand font-medium shadow-none'
									)}
								>
									<Link href={item.href} onClick={onNavigate}>
										<Icon
											className={cn(
												'h-4 w-4',
												active ? 'text-brand' : 'text-muted-foreground'
											)}
											strokeWidth={2}
										/>
										<span className='truncate'>{item.label}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

const SideBar = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { isMobile, setOpenMobile } = useSidebar();

	const closeMobileSidebar = () => {
		if (isMobile) setOpenMobile(false);
	};

	useEffect(() => {
		setOpenMobile(false);
	}, [pathname, setOpenMobile]);

	return (
		<Sidebar
			collapsible='icon'
			className='mt-16 border-r border-sidebar-border'
		>
			<SidebarContent className='bg-sidebar text-sidebar-foreground gap-1'>
				<div className='flex md:hidden items-center px-4 pt-5 pb-3'>
					<ThemeLogo
						alt='logo'
						width={100}
						height={40}
						className='h-8 w-auto object-contain'
					/>
				</div>

				<NavGroup
					label='Overview'
					items={overviewItems}
					pathname={pathname}
					onNavigate={closeMobileSidebar}
				/>
				<SidebarSeparator className='mx-3 bg-sidebar-border' />
				<NavGroup
					label='Money'
					items={moneyItems}
					pathname={pathname}
					onNavigate={closeMobileSidebar}
				/>
				<SidebarSeparator className='mx-3 bg-sidebar-border' />
				<NavGroup
					label='Trading'
					items={tradingItems}
					pathname={pathname}
					onNavigate={closeMobileSidebar}
				/>
				<SidebarSeparator className='mx-3 bg-sidebar-border' />
				<NavGroup
					label='People'
					items={peopleItems}
					pathname={pathname}
					onNavigate={closeMobileSidebar}
				/>

				<div className='mt-auto px-2 pb-3'>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip='Logout'
								className='h-10 rounded-xl px-2.5 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive'
								onClick={async () => {
									closeMobileSidebar();
									await logoutAdmin();
									router.push('/admin/login');
								}}
							>
								<LogOut className='h-4 w-4' />
								<span>Logout</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</div>
			</SidebarContent>
			<SidebarFooter className='border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden'>
				<p className='px-1 text-[11px] leading-relaxed text-brand'>
					Admin control workspace
				</p>
			</SidebarFooter>
		</Sidebar>
	);
};

export default SideBar;
