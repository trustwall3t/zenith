import { PrismaClient } from '@/generated/prisma';

const prismaClientSingleton = () => {
	// Validate DATABASE_URL is set
	if (!process.env.DATABASE_URL) {
		throw new Error(
			'DATABASE_URL environment variable is not set. ' +
			'Please set DATABASE_URL in your environment variables. ' +
			'If deploying to Cloudflare, add it in your Cloudflare dashboard under Environment Variables.'
		);
	}

	return new PrismaClient({
		log: ['query'],
	});
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
