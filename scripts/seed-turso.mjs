import { createClient } from '@libsql/client';
import { TURSO_SCHEMA } from './turso-schema.mjs';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO env variables. Check your .env file.");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function run() {
  console.log("Migrating Turso Schema...");
  const queries = TURSO_SCHEMA.split(';').filter(q => q.trim().length > 0);
  
  for (const q of queries) {
    try {
      if (q.trim().length === 0) continue;
      await client.execute(q + ';');
      console.log("Executed constraint successfully.");
    } catch (e) {
      console.error("Error executing query:", q);
      console.error(e);
      process.exit(1);
    }
  }
  
  console.log("✅ Turso Migration Complete!");
}

run();
