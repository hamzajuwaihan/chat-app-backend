import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from './database.config';

const dbConfig = databaseConfig();

const AppDataSource = new DataSource({
  ...dbConfig,
  entities: ['src/**/domain/entities/*.entity.ts'],
  migrations: ['src/app/infrastructure/database/migrations/*-migration.ts'],
  migrationsRun: true,
} as DataSourceOptions);

export default AppDataSource;
