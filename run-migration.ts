import { DataSource } from 'typeorm';
import { FixEventTicketPrice1700000000004 } from './src/migrations/1700000000004-FixEventTicketPrice';
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
    migrations: [FixEventTicketPrice1700000000004]
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const migration = new FixEventTicketPrice1700000000004();
    await migration.up(dataSource.createQueryRunner());
    
    console.log('Migration completed successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
