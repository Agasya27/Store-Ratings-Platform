const app = require('./app');
const { config, assertConfig } = require('./config/env');
const { pool } = require('./config/db');

assertConfig();

async function start() {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

start();
