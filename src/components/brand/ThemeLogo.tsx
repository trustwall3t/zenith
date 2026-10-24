"use client";

import Image, { type ImageProps } from "next/image";
import {
	SITE_LOGO_URL_DARK_THEME,
	SITE_LOGO_URL_LIGHT_THEME,
} from "@/lib/public/site-logo";
import { cn } from "@/lib/utils";

type ThemeLogoProps = Omit<ImageProps, "src"> & {
	lightSrc?: string;
	darkSrc?: string;
};

/**
 * Renders black logo in light mode and white logo in dark mode.
 */
export function ThemeLogo({
	className,
	lightSrc = SITE_LOGO_URL_LIGHT_THEME,
	darkSrc = SITE_LOGO_URL_DARK_THEME,
	alt = "Logo",
	...props
}: ThemeLogoProps) {
	return (
		<>
			<Image
				src={lightSrc}
				alt={alt}
				className={cn(className, "dark:hidden")}
				{...props}
			/>
			<Image
				src={darkSrc}
				alt={alt}
				className={cn(className, "hidden dark:block")}
				{...props}
			/>
		</>
	);
}

type ThemeBrandImgProps = {
	className?: string;
	alt?: string;
	width?: number;
	height?: number;
	lightSrc?: string;
	darkSrc?: string;
};

/** Plain `<img>` variant for legacy public CSS layouts. */
export function ThemeBrandImg({
	className,
	alt = "Logo",
	width,
	height,
	lightSrc = SITE_LOGO_URL_LIGHT_THEME,
	darkSrc = SITE_LOGO_URL_DARK_THEME,
}: ThemeBrandImgProps) {
	return (
		<>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				className={cn(className, "dark:hidden")}
				src={lightSrc}
				alt={alt}
				width={width}
				height={height}
			/>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				className={cn(className, "hidden dark:block")}
				src={darkSrc}
				alt={alt}
				width={width}
				height={height}
			/>
		</>
	);
}
