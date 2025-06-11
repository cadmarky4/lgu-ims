import { PrismaClient } from '@prisma/client';
import { logger } from '@/shared/utils/logger';

let prisma: PrismaClient;

export const connectDatabase = async (): Promise<void> => {
  try {
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    await prisma.$connect();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

export const getDatabase = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Database not initialized. Call connectDatabase first.');
  }
  return prisma;
};
