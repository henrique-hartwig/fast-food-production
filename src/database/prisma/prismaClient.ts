import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

let prismaClient: PrismaClient | null = null;

export async function getPrismaClient(): Promise<PrismaClient> {
  console.log('MODULE PATHS: ', module.paths);
  if (prismaClient) {
    return prismaClient;
  }

  try {
    const credentials = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      dbname: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!
    };
    
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
