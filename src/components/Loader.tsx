"use client";

import { BrandLoader } from "@/components/brand/BrandLoader";

/** Inline brand-aligned loading indicator (forms, buttons). */
export function Loader() {
	return (
		<div className="flex items-center justify-center py-3">
			<BrandLoader size="sm" surface="theme" showBar={false} />
		</div>
	);
}
