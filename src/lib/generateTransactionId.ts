export const generateTransactionId = () => {
	const timestamp = Date.now().toString();
	const random = Math.random().toString(36).substring(2, 8);
	return `TXN-${timestamp}-${random}`;
};