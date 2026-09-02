const { query } = require('../config/db');

async function getOwnedStoreSummary(ownerId) {
  const result = await query(
    `SELECT s.id, s.name, s.email, s.address,
            COALESCE(ROUND(AVG(r.value)::numeric, 2), 0) AS average_rating,
            COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [ownerId]
  );
  return result.rows[0] || null;
}

async function getRatersForOwner(ownerId) {
  const result = await query(
    `SELECT u.id, u.name, u.email, r.value AS rating, r.created_at, r.updated_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     JOIN stores s ON s.id = r.store_id
     WHERE s.owner_id = $1
     ORDER BY r.created_at DESC`,
    [ownerId]
  );
  return result.rows;
}

module.exports = { getOwnedStoreSummary, getRatersForOwner };
