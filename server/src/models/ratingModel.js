const { query } = require('../config/db');

async function countAll() {
  const result = await query('SELECT COUNT(*)::int AS count FROM ratings');
  return result.rows[0].count;
}

async function upsertRating(userId, storeId, value) {
  const result = await query(
    `INSERT INTO ratings (user_id, store_id, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET value = EXCLUDED.value
     RETURNING id, user_id, store_id, value, created_at, updated_at`,
    [userId, storeId, value]
  );
  return result.rows[0];
}

async function findByUserAndStore(userId, storeId) {
  const result = await query(
    'SELECT id, user_id, store_id, value, created_at, updated_at FROM ratings WHERE user_id = $1 AND store_id = $2',
    [userId, storeId]
  );
  return result.rows[0] || null;
}

module.exports = { countAll, upsertRating, findByUserAndStore };
