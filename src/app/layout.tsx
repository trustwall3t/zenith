import DynamicStyles from '@/components/DynamicStyles';
import { PublicDesktopLockLifecycle } from '@/components/public/PublicDesktopLockLifecycle';
import SmartsuppScript from '@/components/SmartsuppScript';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DesktopViewport } from '@/components/public/DesktopViewport';
import { GG_LAYOUT_WIDTH } from '@/lib/public/gg-layout-width';
import { ggViewportBootstrapScript } from '@/lib/public/gg-viewport-bootstrap';
import {
	defaultAppViewport,
	resolveMarketingViewport,
} from '@/lib/public/gg-viewport-server';
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

export async function generateViewport(): Promise<Viewport> {
	const h = await headers();
	const pathname = h.get('x-pathname') ?? '';
	if (isPublicMarketingRoute(pathname)) {
		return resolveMarketingViewport(h);
	}
	return defaultAppViewport;
}

export const metadata: Metadata = {
	title: {
		default: 'Zenith Habour',
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
			<head>
				{isMarketing ? (
					<script
						id='gg-viewport-bootstrap'
						dangerouslySetInnerHTML={{
							__html: ggViewportBootstrapScript(GG_LAYOUT_WIDTH),
						}}
					/>
				) : null}
			</head>
			<body className={bodyClass} suppressHydrationWarning>
				{isMarketing ? <DesktopViewport /> : null}
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
