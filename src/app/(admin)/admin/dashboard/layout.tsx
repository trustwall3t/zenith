export const dynamic = 'force-dynamic';

import SideBar from '@/app/(admin)/components/Sidebar';
import {
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
} from '@/components/ui/menubar';
import {
	Menubar,
	MenubarContent,
	MenubarTrigger,
} from '@/components/ui/menubar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronDown, Settings2, UserRound } from 'lucide-react';
import { ThemeLogo } from '@/components/brand/ThemeLogo';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<SideBar />
			<main className='w-full min-h-screen bg-background text-foreground'>
				<header className='fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6 md:px-8'>
					<div className='flex items-center gap-3'>
						<SidebarTrigger className='text-foreground' />
						<div className='hidden sm:flex items-center border-l border-border pl-3'>
							<Link href='/admin/dashboard' className='flex items-center'>
								<ThemeLogo
									alt='logo'
									width={100}
									height={40}
									className='h-8 w-auto object-contain'
								/>
							</Link>
						</div>
					</div>

					<div className='flex items-center gap-1'>
						<ThemeToggle />
						<Menubar className='border-none bg-transparent shadow-none'>
							<MenubarMenu>
								<MenubarTrigger className='flex items-center gap-2 bg-transparent text-foreground data-[state=open]:bg-accent'>
									<div className='flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted'>
										<UserRound className='h-4 w-4 text-muted-foreground' strokeWidth={2} />
									</div>
									<div className='hidden sm:flex flex-col items-start'>
										<p className='text-sm font-medium text-foreground'>
											Admin
										</p>
										<p className='text-xs text-muted-foreground'>
											support@apextradezone.com
										</p>
									</div>
									<ChevronDown className='h-4 w-4 text-muted-foreground' strokeWidth={2} />
								</MenubarTrigger>
								<MenubarContent className='bg-popover text-popover-foreground border-border'>
									<MenubarItem asChild>
										<Link
											href='/admin/dashboard/settings'
											className='flex items-center gap-2'
										>
											<UserRound className='h-4 w-4' strokeWidth={2} />
											Profile
										</Link>
									</MenubarItem>
									<MenubarSeparator />
									<MenubarItem asChild>
										<Link
											href='/admin/dashboard/settings'
											className='flex items-center gap-2'
										>
											<Settings2 className='h-4 w-4' strokeWidth={2} />
											Settings
										</Link>
									</MenubarItem>
									<MenubarSeparator />
									<MenubarItem>
										<LogoutButton />
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					</div>
				</header>

				<div className='md:p-8 p-4 mt-16 min-h-[calc(100vh-8rem)]'>
					{children}
				</div>

				<footer className='flex items-center justify-between border-t border-border px-4 py-6 text-muted-foreground sm:px-8'>
					<p className='text-sm capitalize'>
						Copyright {new Date().getFullYear()} &copy; All rights
						reserved
					</p>
					<Link
						href='/privacy-policy'
						className='text-sm hover:text-foreground transition-colors'
					>
						Privacy Policy
					</Link>
				</footer>
			</main>
		</SidebarProvider>
	);
};

export default AdminDashboardLayout;
