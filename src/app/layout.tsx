import DynamicStyles from '@/components/DynamicStyles';
import { PublicDesktopLockLifecycle } from '@/components/public/PublicDesktopLockLifecycle';
import SmartsuppScript from '@/components/SmartsuppScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GG_LAYOUT_WIDTH } from '@/lib/public/gg-layout-width';
import { isPublicMarketingRoute } from '@/lib/public/marketing-routes';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
});

/** Auth, dashboard, admin — normal responsive viewport (marketing overrides in its layout). */
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
};

export const metadata: Metadata = {
	title: {
		default: 'Zenith Growth',
		template: '%s',
	},
	description: 'Investment platform — copy trading, plans, and member dashboard.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = (await headers()).get('x-pathname') ?? '';
	const isMarketing = isPublicMarketingRoute(pathname);

	const htmlClass = isMarketing
		? 'gg-public-root gg-desktop-lock gg-desktop-boot'
		: undefined;
	const htmlStyle = isMarketing
		? ({ ['--gg-desktop-lock-width' as string]: `${GG_LAYOUT_WIDTH}px` } as const)
		: undefined;

	const bodyClass = [
		isMarketing ? 'gg-public gg-desktop-lock' : '',
		geistSans.variable,
		geistMono.variable,
		isMarketing ? '' : 'font-sans',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<html lang='en' className={htmlClass} style={htmlStyle} suppressHydrationWarning>
			<body className={bodyClass} suppressHydrationWarning>
				<ThemeProvider>
					<PublicDesktopLockLifecycle />
					<DynamicStyles />
					<SmartsuppScript />
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
