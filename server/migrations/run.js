const fs = require('fs');
const path = require('path');
const { assertConfig } = require('../src/config/env');

assertConfig({ requireAuth: false });

const { pool } = require('../src/config/db');

async function run() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
