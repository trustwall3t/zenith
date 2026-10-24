import { db } from "@/lib/db";

export const getAllTrade = async () => {
    const trade = await db.transaction.findMany({
        where: {
            transactionType: 'trading',
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });
    return trade;
};
export const getAllApprovedTrade = async () => {
    const trade = await db.transaction.count({
        where: {
            transactionType: 'trading',
            status: 'success',
        },
    });
    return trade;
};
export const getAllCancelledTrade = async () => {
    const trade = await db.transaction.count({
        where: {
            transactionType: 'trading',
            status: 'cancelled',
        },
    });
    return trade;
};
export const getAllTrades = async () => {
    const trade = await db.transaction.count({
        where: {
            transactionType: 'trading',
        },
    });
    return trade;
};