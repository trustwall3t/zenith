"use client";

import { useTheme } from "next-themes";
import {
	CircleCheck,
	CircleX,
	Info,
	TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useEffect, useState } from "react";

const toastClassNames = {
	toast:
		"group toast zenith-toast flex w-full items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-card-foreground shadow-lg shadow-black/5 ring-1 ring-black/[0.04] dark:shadow-black/25 dark:ring-white/[0.06]",
	title: "text-sm font-semibold leading-snug tracking-tight text-foreground",
	description: "text-xs leading-relaxed text-muted-foreground",
	actionButton:
		"rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand-muted",
	cancelButton:
		"rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent",
	closeButton:
		"rounded-md border border-border/80 bg-background/80 text-muted-foreground transition-colors hover:bg-brand-soft hover:text-brand",
} as const;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Sonner
			theme={mounted ? (theme as ToasterProps["theme"]) : "light"}
			className="toaster group zenith-toaster"
			position="top-right"
			offset={16}
			gap={10}
			visibleToasts={4}
			closeButton
			richColors={false}
			icons={{
				success: (
					<CircleCheck
						className="h-5 w-5 shrink-0 text-[var(--success)]"
						strokeWidth={2}
					/>
				),
				error: (
					<CircleX
						className="h-5 w-5 shrink-0 text-destructive"
						strokeWidth={2}
					/>
				),
				warning: (
					<TriangleAlert
						className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
						strokeWidth={2}
					/>
				),
				info: (
					<Info className="h-5 w-5 shrink-0 text-brand" strokeWidth={2} />
				),
				loading: (
					<span className="zenith-toast-spinner h-5 w-5 shrink-0 rounded-full border-2 border-brand-soft border-t-brand" />
				),
			}}
			toastOptions={{
				classNames: toastClassNames,
			}}
			style={
				{
					"--normal-bg": "var(--card)",
					"--normal-text": "var(--card-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius-xl)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
