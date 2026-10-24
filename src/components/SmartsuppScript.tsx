'use client';

import { useEffect } from 'react';

declare global {
	interface Window {
		_smartsupp?: { key?: string };
		smartsupp?: unknown;
	}
}

export default function SmartsuppScript() {
	useEffect(() => {
		// Only run on client side
		if (typeof window === 'undefined') return;

		// Initialize Smartsupp
		const _smartsupp = window._smartsupp ?? {};
		_smartsupp.key = '358ab5419be7123e646f7cc3f293964f071f7859';
		window._smartsupp = _smartsupp;

		if (!window.smartsupp) {
			const d = document;
			const s = d.getElementsByTagName('script')[0];
			const c = d.createElement('script');
			c.type = 'text/javascript';
			c.charset = 'utf-8';
			c.async = true;
			c.src = 'https://www.smartsuppchat.com/loader.js?';
			if (s && s.parentNode) {
				s.parentNode.insertBefore(c, s);
			}
		}
	}, []);

	return null;
}

