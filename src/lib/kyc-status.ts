/** Normalized KYC gate — matches dashboard home + admin verify flows. */

export type KycDisplayState = "complete" | "pending" | "required";

function normalizeStatus(status: string | undefined | null): string {
	return (status ?? "").trim().toLowerCase();
}

export function isKycApprovedStatus(status: string | undefined | null): boolean {
	const s = normalizeStatus(status);
	return s === "approved" || s === "success";
}

export function isKycPendingStatus(status: string | undefined | null): boolean {
	return normalizeStatus(status) === "pending";
}

export function resolveKycDisplayState(user: {
	isVerified: boolean;
	kyc?: { status: string }[];
}): KycDisplayState {
	if (user.isVerified) return "complete";

	const statuses = (user.kyc ?? []).map((k) => normalizeStatus(k.status));
	if (statuses.some(isKycApprovedStatus)) return "complete";
	if (statuses.some(isKycPendingStatus)) return "pending";

	return "required";
}

export function resolveKycStatusLabel(user: {
	isVerified: boolean;
	kyc?: { status: string }[];
}): string {
	if (user.isVerified) return "approved";
	const rows = user.kyc ?? [];
	const statuses = rows.map((k) => normalizeStatus(k.status));
	if (statuses.some((s) => isKycApprovedStatus(s))) return "approved";
	if (statuses.some((s) => isKycPendingStatus(s))) return "pending";
	return rows[0]?.status ?? "none";
}
