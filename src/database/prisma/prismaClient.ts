console.log('MODULE PATHS: ', module.paths);
console.log('NODE_PATH:', process.env.NODE_PATH);
console.log('LAYER PATH:', require.resolve.paths('@prisma/client'));
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';


export function getPrismaClient(): PrismaClient {
  try {
    const prismaClient = new PrismaClient();
    
    logger.info('Prisma client initialized successfully');
    return prismaClient;
  } catch (error) {
    logger.error('Failed to initialize Prisma client', error);
    throw error;
  }
}

export default getPrismaClient();
