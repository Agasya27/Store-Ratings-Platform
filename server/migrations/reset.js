const bcrypt = require('bcryptjs');
const { config, assertConfig } = require('../src/config/env');

assertConfig({ requireAuth: false });

const { pool } = require('../src/config/db');

async function reset() {
  const { name, email, password, address } = config.seedAdmin;

  try {
    await pool.query('DELETE FROM ratings');
    await pool.query('DELETE FROM stores');
    await pool.query('DELETE FROM users WHERE email <> $1', [email]);

    const passwordHash = await bcrypt.hash(password, 10);
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

    console.log('Database reset complete. Only seeded admin remains.');
    console.log(`Admin email: ${email}`);
  } catch (err) {
    console.error('Reset failed:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
