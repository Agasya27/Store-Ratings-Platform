const { Pool } = require('pg');
const { config } = require('./env');

function buildPoolConfig() {
  const connectionString = config.databaseUrl;
  const useSsl =
    process.env.PGSSLMODE === 'require' ||
    process.env.RAILWAY_ENVIRONMENT ||
    (connectionString && connectionString.includes('railway.app'));

  return {
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  };
}

const pool = new Pool(buildPoolConfig());

function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
