"use client";

import { PublicBootLoader } from "@/components/brand/BrandLoader";
import { useEffect, useState } from "react";

/** Branded splash until viewport scale is stable (real devices need this; simulators often skip). */
export function PublicBootGate() {
	const [booting, setBooting] = useState(true);

	useEffect(() => {
		const html = document.documentElement;

		const finish = () => {
			setBooting(false);
		};

		const tryFinish = () => {
			if (
				html.classList.contains("gg-desktop-ready") &&
				html.classList.contains("gg-layout-ready")
			) {
				requestAnimationFrame(() => {
					requestAnimationFrame(finish);
				});
			}
		};

		tryFinish();
		html.addEventListener("gg-viewport-stable", finish);
		html.addEventListener("gg-desktop-ready", tryFinish);
		const timeout = window.setTimeout(finish, 3500);

		return () => {
			html.removeEventListener("gg-viewport-stable", finish);
			html.removeEventListener("gg-desktop-ready", tryFinish);
			window.clearTimeout(timeout);
		};
	}, []);

	if (!booting) return null;
	return <PublicBootLoader />;
}
