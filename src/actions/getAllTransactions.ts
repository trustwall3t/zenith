'use server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export const getAllTransactions = async () => {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const transactions = await db.transaction.findMany({
		where: {
			userId: session.userId,

		},
        include: {
            user: {
                select: {
                   
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
	});

	return transactions;
};

export const getDepositTransactions = async () => {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const transactions = await db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'deposit',
		},
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
	});

	return transactions;
};

export const getWithdrawalTransactions = async () => {
	const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const transactions = await db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'withdrawal',
		},
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
	}); 

	return transactions;
};

export const getTradingTransactions = async () => {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const transactions = await db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'trading',
		},
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
	});

	return transactions;
};
