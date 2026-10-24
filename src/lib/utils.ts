import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateToken() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateReferralCode() {
	return `FD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
