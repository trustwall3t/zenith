"use client";

import {
	SITE_LOGO_URL_ON_DARK_BG,
	SITE_LOGO_URL_ON_LIGHT_BG,
} from "@/lib/public/site-logo";
import { cn } from "@/lib/utils";

type BrandLoaderProps = {
	/** Logo height tier */
	size?: "sm" | "md" | "lg";
	/** Page background the loader sits on */
	surface?: "light" | "dark" | "theme";
	className?: string;
	showBar?: boolean;
	label?: string;
};

const sizeClass = {
	sm: "h-8",
	md: "h-10",
	lg: "h-14",
} as const;

function BrandMark({
	surface,
	size,
}: {
	surface: "light" | "dark" | "theme";
	size: keyof typeof sizeClass;
}) {
	const cls = cn(sizeClass[size], "w-auto object-contain");

	if (surface === "light") {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={SITE_LOGO_URL_ON_LIGHT_BG}
				alt=""
				className={cn(cls, "animate-pulse")}
			/>
		);
	}

	if (surface === "dark") {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={SITE_LOGO_URL_ON_DARK_BG}
				alt=""
				className={cn(cls, "animate-pulse")}
			/>
		);
	}

	return (
		<>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={SITE_LOGO_URL_ON_LIGHT_BG}
				alt=""
				className={cn(cls, "animate-pulse dark:hidden")}
			/>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={SITE_LOGO_URL_ON_DARK_BG}
				alt=""
				className={cn(cls, "hidden animate-pulse dark:block")}
			/>
		</>
	);
}

export function BrandLoader({
	size = "md",
	surface = "theme",
	className,
	showBar = true,
	label = "Loading",
}: BrandLoaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4",
				className,
			)}
			role="status"
			aria-live="polite"
			aria-label={label}
		>
			<BrandMark surface={surface} size={size} />
			{showBar ? (
				<div className="h-0.5 w-28 overflow-hidden rounded-full bg-brand-soft">
					<div className="brand-loader-bar h-full w-2/5 rounded-full bg-brand" />
				</div>
			) : null}
			<span className="sr-only">{label}</span>
		</div>
	);
}

/** Full-screen overlay aligned with public marketing (`--gg-paper`). */
export function PublicBootLoader() {
	return (
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center"
			style={{ background: "var(--gg-paper, #faf9f7)" }}
		>
			<BrandLoader size="lg" surface="light" />
		</div>
	);
}
