#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runSqlFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required.');
    console.error('Example: postgres://user:pass@localhost:5432/postgres');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const initFile = path.join(migrationsDir, 'init.sql');
    const seedFile = path.join(migrationsDir, 'seed.sql');

    console.log('Running init.sql...');
    await runSqlFile(client, initFile);
    console.log('Running seed.sql...');
    await runSqlFile(client, seedFile);

    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
