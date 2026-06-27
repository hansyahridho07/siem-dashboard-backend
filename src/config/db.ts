import { DataSource } from 'typeorm';
import { AssetEntity } from '../entities/asset.entity';
import { HighlightedIpEntity } from '../entities/ip.entity';
import { env } from './env';

const host = env.DB_HOST;
const port = env.DB_PORT;
const username = env.DB_USERNAME;
const password = env.DB_PASSWORD;
const database = env.DB_DATABASE;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  synchronize: false, // Ensure we do NOT auto-migrate on every start
  logging: true,
  entities: [AssetEntity, HighlightedIpEntity],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  subscribers: [],
});

// Helper to initialize db
export const initializeDatabase = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('PostgreSQL Database connected successfully via TypeORM.');
    } catch (error) {
      console.error('Error during PostgreSQL Database initialization:', error);
      throw error;
    }
  }
  return AppDataSource;
};

// Helper to check PG connection for health checks
export const checkPgConnection = async (): Promise<boolean> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    // Perform simple query to verify active connectivity
    await AppDataSource.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('PostgreSQL Connection check failed:', error);
    return false;
  }
};
