import { PrismaClient } from '@prisma/client';
import { getDbCredentials } from '../../aws/secretsManager';
import logger from '../../../utils/logger';

let prismaClient: PrismaClient | null = null;

export async function getPrismaClient(): Promise<PrismaClient> {
  if (prismaClient) {
    return prismaClient;
  }

  try {
    const credentials = await getDbCredentials();
    
    const databaseUrl = `postgresql://${credentials.username}:${encodeURIComponent(credentials.password)}@${credentials.host}:${credentials.port}/${credentials.dbname}?schema=public`;
    
    process.env.DATABASE_URL = databaseUrl;
    
    prismaClient = new PrismaClient();
    
    logger.info('Prisma client initialized successfully');
    return prismaClient;
  } catch (error) {
    logger.error('Failed to initialize Prisma client', error);
    throw error;
  }
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
    logger.info('Conexão com o Prisma encerrada');
  }
}

export default getPrismaClient();
