import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '54321', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chat_app',
  synchronize: false,
  logging: true,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: true,
});

export default AppDataSource;
