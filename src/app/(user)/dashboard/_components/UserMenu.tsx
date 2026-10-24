'use client';

import { useUser } from '@/lib/context/UserContext';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from '@/components/ui/menubar';
import {
	ArrowDownToLine,
	ArrowUpFromLine,
	ChevronDown,
	Settings2,
	UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { Logout } from './Logout';

export const UserMenu = () => {
	const { user, loading } = useUser();

	if (loading) {
		return (
			<div className='h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-muted animate-pulse' />
		);
	}

	return (
		<Menubar className='border-none bg-transparent shadow-none'>
			<MenubarMenu>
				<MenubarTrigger className='flex items-center gap-2 bg-transparent text-foreground data-[state=open]:bg-accent'>
					<div className='flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted'>
						<UserRound className='h-4 w-4 text-muted-foreground' strokeWidth={2} />
					</div>
					<div className='hidden sm:flex flex-col items-start'>
						<p className='text-sm font-medium text-foreground truncate max-w-[140px]'>
							{user?.name?.split(' ')[0]}
						</p>
						<p className='text-xs text-muted-foreground truncate max-w-[160px]'>
							{user?.email}
						</p>
					</div>
					<ChevronDown className='h-4 w-4 text-muted-foreground' strokeWidth={2} />
				</MenubarTrigger>
				<MenubarContent className='bg-popover text-popover-foreground border-border'>
					<MenubarItem asChild>
						<Link
							href='/dashboard/settings'
							className='flex items-center gap-2'
						>
							<UserRound className='h-4 w-4' strokeWidth={2} />
							Profile
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem asChild>
						<Link
							href='/dashboard/withdraw'
							className='flex items-center gap-2'
						>
							<ArrowUpFromLine className='h-4 w-4' strokeWidth={2} />
							Withdraw
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem asChild>
						<Link
							href='/dashboard/settings'
							className='flex items-center gap-2'
						>
							<Settings2 className='h-4 w-4' strokeWidth={2} />
							Settings
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem asChild>
						<Link
							href='/dashboard/deposit'
							className='flex items-center gap-2'
						>
							<ArrowDownToLine className='h-4 w-4' strokeWidth={2} />
							Deposit
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Logout />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};
