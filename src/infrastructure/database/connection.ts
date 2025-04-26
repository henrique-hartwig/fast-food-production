import { Pool, PoolClient } from 'pg';
import { getDbCredentials } from '../../infrastructure/aws/secretsManager';
import logger from '../../utils/logger';

let pool: Pool | null = null;

export async function initializeDbConnection(): Promise<void> {
  if (pool) {
    return;
  }

  try {
    const credentials = await getDbCredentials();
    
    pool = new Pool({
      host: credentials.host,
      port: credentials.port,
      database: credentials.dbname,
      user: credentials.username,
      password: credentials.password,
      ssl: process.env.NODE_ENV !== 'local' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const client = await pool.connect();
    client.release();
    
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to initialize database connection', error);
    throw error;
  }
}

export async function getDbClient(): Promise<PoolClient> {
  if (!pool) {
    await initializeDbConnection();
  }
  
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  
  return pool.connect();
}

export async function closeDbConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection closed');
  }
} 