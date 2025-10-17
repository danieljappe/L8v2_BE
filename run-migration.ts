import { DataSource } from 'typeorm';
import { AddBillettoURLToEvent1700000000005 } from './src/migrations/1700000000005-AddBillettoURLToEvent';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'l8v2',
    synchronize: false,
    logging: true,
    entities: [],
    migrations: [AddBillettoURLToEvent1700000000005]
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const migration = new AddBillettoURLToEvent1700000000005();
    await migration.up(dataSource.createQueryRunner());
    
    console.log('Migration completed successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
