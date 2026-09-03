const { query } = require('../config/db');
const { parseSort } = require('../utils/queryHelpers');

const RATER_SORT_COLUMNS = ['name', 'email', 'rating', 'created_at'];

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

async function getRatersForOwner(ownerId, sortOptions = {}) {
  const { column, order } = parseSort(
    sortOptions.sortBy,
    sortOptions.sortOrder,
    RATER_SORT_COLUMNS,
    'created_at'
  );
  const sortColumn =
    column === 'name' || column === 'email' ? `u.${column}` : column === 'rating' ? 'r.value' : 'r.created_at';

  const result = await query(
    `SELECT u.id, u.name, u.email, r.value AS rating, r.created_at, r.updated_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     JOIN stores s ON s.id = r.store_id
     WHERE s.owner_id = $1
     ORDER BY ${sortColumn} ${order}`,
    [ownerId]
  );
  return result.rows;
}

module.exports = { getOwnedStoreSummary, getRatersForOwner };
