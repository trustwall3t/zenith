export const dynamic = 'force-dynamic';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import { DashboardBottomNav } from './_components/DashboardBottomNav';
import SideBar from './_components/SideBar';
import Link from 'next/link';
import { ThemeLogo } from '@/components/brand/ThemeLogo';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/lib/context/UserContext';
import { UserMenu } from './_components/UserMenu';
import { Clock3, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import { Button } from '@/components/ui/button';
import { resolveKycDisplayState } from '@/lib/kyc-status';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getSession();
	if (!session) {
		redirect('/auth/login');
	}

	const kycState = resolveKycDisplayState(session.user);

	return (
		<UserProvider>
			<SidebarProvider>
				<SideBar />
				<main className='flex min-h-screen w-full flex-col bg-background text-foreground'>
					<header className='fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6 md:px-8'>
						<div className='flex items-center gap-3'>
							<SidebarTrigger className='text-foreground' />
							<div className='hidden sm:flex items-center border-l border-border pl-3'>
								<Link
									href='/dashboard'
									className='flex items-center'
								>
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
							<UserMenu />
						</div>
					</header>

					<div className='mt-16 flex-1 p-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:p-8 md:pb-8'>
						{kycState === 'required' ? (
							<div className='mb-4 flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive sm:flex-row sm:items-center sm:justify-between'>
								<p className='text-sm font-medium flex items-center gap-2'>
									<ShieldAlert className='h-4 w-4 shrink-0' strokeWidth={2} />
									Please complete your KYC to continue trading
								</p>
								<Button
									asChild
									variant='destructive'
									size='sm'
									className='w-fit'
								>
									<Link href='/dashboard/kyc'>Complete KYC</Link>
								</Button>
							</div>
						) : null}
						{kycState === 'pending' ? (
							<div className='mb-4 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400'>
								<Clock3 className='h-4 w-4 shrink-0' strokeWidth={2} />
								<p className='text-sm font-medium'>
									Please wait for your KYC to be approved
								</p>
							</div>
						) : null}
						{children}
					</div>

					<DashboardBottomNav />

					<footer className='hidden items-center justify-between border-t border-border px-4 py-6 text-muted-foreground sm:px-8 md:flex'>
						<p className='text-sm capitalize'>
							Copyright {new Date().getFullYear()} &copy; All
							rights reserved
						</p>
						<Link
							href='/privacy-policy'
							className='text-sm hover:text-foreground transition-colors'
						>
							Terms
						</Link>
					</footer>
				</main>
			</SidebarProvider>
		</UserProvider>
	);
};

export default DashboardLayout;
