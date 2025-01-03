import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';

const dbConfig = databaseConfig();

const AppDataSource = new DataSource({
  ...dbConfig,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: true,
} as DataSourceOptions);

export default AppDataSource;
