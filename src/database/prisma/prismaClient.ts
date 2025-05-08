import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

export default function getPrismaClient(): PrismaClient {
  try {
    const prismaClient = new PrismaClient();
    logger.info('Prisma client initialized successfully');
    return prismaClient;
  } catch (error) {
    logger.error('Failed to initialize Prisma client', error);
    throw error;
  }
}
