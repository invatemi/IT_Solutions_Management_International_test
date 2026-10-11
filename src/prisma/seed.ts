import 'dotenv/config';
import { createDb } from './db.js';
import { seedIfEmpty } from './seed-database.js';

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const db = createDb(databaseUrl);

seedIfEmpty(db)
  .then(() => db.close())
  .catch(async (error: unknown) => {
    console.error(error);
    await db.close();
    process.exitCode = 1;
  });
