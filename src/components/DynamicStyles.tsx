'use client';

import { BrandLoader } from '@/components/brand/BrandLoader';
import { isPublicMarketingRoute } from '@/lib/public/marketing-routes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DynamicStyles() {
	const pathname = usePathname();
	const isMarketing = isPublicMarketingRoute(pathname);
	const [isLoading, setIsLoading] = useState(!isMarketing);
	const [legacyDarkOverlay, setLegacyDarkOverlay] = useState(false);

	useEffect(() => {
		if (isMarketing) {
			setIsLoading(false);
			setLegacyDarkOverlay(false);
			return;
		}

		// Legacy public pages (non-marketing) — load `/assets` stylesheets
		if (
			!pathname.startsWith('/admin') &&
			!pathname.startsWith('/dashboard') &&
			!pathname.startsWith('/auth')
		) {
			setIsLoading(true);
			setLegacyDarkOverlay(true);
			const styleLinks = [
				'/assets/css/style.css',
				'/assets/css/custom.css',
			];

			let loadedStyles = 0;
			const totalStyles = styleLinks.length;

			const markLoaded = () => {
				loadedStyles++;
				if (loadedStyles >= totalStyles) {
					setIsLoading(false);
				}
			};

			styleLinks.forEach((href) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = href;
				link.onload = markLoaded;
				link.onerror = markLoaded;
				document.head.appendChild(link);
			});

			const blackBackgroundStyle = document.createElement('style');
			blackBackgroundStyle.textContent = `
				body {
					background-color: #000000;
				}
			`;
			document.head.appendChild(blackBackgroundStyle);

			return () => {
				styleLinks.forEach((href) => {
					const links = document.querySelectorAll(
						`link[href="${href}"]`,
					);
					links.forEach((link) => link.remove());
				});
				blackBackgroundStyle.remove();
			};
		}

		setLegacyDarkOverlay(false);
		setIsLoading(false);
	}, [pathname, isMarketing]);

	if (isMarketing || !isLoading) {
		return null;
	}

	return (
		<div
			className={
				legacyDarkOverlay
					? 'fixed inset-0 z-[9999] flex items-center justify-center bg-black'
					: 'fixed inset-0 z-[9999] flex items-center justify-center bg-background'
			}
		>
			<BrandLoader
				size="lg"
				surface={legacyDarkOverlay ? 'dark' : 'theme'}
			/>
		</div>
	);
}
