import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskModel } from './model/TaskModel';
import { UserModel } from './model/UserModel';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: String(process.env.DB_HOST) || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  migrationsTransactionMode: 'each',
  synchronize: String(process.env.NODE_ENV) === 'production' ? false : true,
  logging: false,
  entities: [UserModel, TaskModel],
  migrations: ['src/infra/database/typeorm/migrations/*.ts'],
  subscribers: [],
});
