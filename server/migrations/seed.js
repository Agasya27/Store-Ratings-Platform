const bcrypt = require('bcryptjs');
const { config, assertConfig } = require('../src/config/env');

assertConfig({ requireAuth: false });

const { pool } = require('../src/config/db');

async function seed() {
  const { name, email, password, address } = config.seedAdmin;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, 'ADMIN')
       ON CONFLICT (email)
       DO UPDATE SET name = EXCLUDED.name,
                     password_hash = EXCLUDED.password_hash,
                     address = EXCLUDED.address,
                     role = 'ADMIN'`,
      [name, email, passwordHash, address]
    );
    console.log(`Seeded default admin: ${email}`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
