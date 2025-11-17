import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: String(process.env.DB_HOST) || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  synchronize: String(process.env.NODE_ENV) === 'production' ? false : true,
  logging: false,
  entities: ['./src/infra/database/typeorm/model/*.ts'],
});

export const initializeDataSource = async (): Promise<DataSource> => {
  const initializedDataSource = !AppDataSource.isInitialized
    ? await AppDataSource.initialize()
    : AppDataSource;
  return initializedDataSource;
};
