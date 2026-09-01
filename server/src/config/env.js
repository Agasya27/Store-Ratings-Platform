require('dotenv').config();

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;
  if (PGUSER && PGHOST && PGDATABASE) {
    const auth = PGPASSWORD ? `${PGUSER}:${PGPASSWORD}` : PGUSER;
    const port = PGPORT || '5432';
    return `postgresql://${auth}@${PGHOST}:${port}/${PGDATABASE}`;
  }
  return undefined;
}

const config = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: resolveDatabaseUrl(),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || 'System Administrator Account',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@storeratings.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    address: process.env.SEED_ADMIN_ADDRESS || '1 Admin Street, HQ',
  },
};

function assertConfig({ requireAuth = true } = {}) {
  const missing = [];
  if (!config.databaseUrl) missing.push('DATABASE_URL (or PGUSER/PGHOST/PGDATABASE)');
  if (requireAuth && !config.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    console.error(
      `\nMissing required environment variable(s): ${missing.join(', ')}.\n` +
        'Copy server/.env.example to server/.env and fill in the values.\n'
    );
    process.exit(1);
  }
}

module.exports = { config, assertConfig };
