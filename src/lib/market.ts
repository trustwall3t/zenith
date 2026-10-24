export type MarketAsset = {
	id: string;
	symbol: string;
	name: string;
	price: number;
	changePercent: number;
	changeAbsolute: number;
	image?: string;
	/** Recent prices for mini area charts (oldest → newest). */
	sparkline: number[];
};
