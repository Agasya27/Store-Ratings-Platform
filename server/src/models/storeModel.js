const { query } = require('../config/db');
const { parsePagination, parseSort } = require('../utils/queryHelpers');

const STORE_FIELDS = 's.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at';
const STORE_SORT_COLUMNS = ['name', 'email', 'address', 'average_rating', 'created_at'];

async function createStore({ name, email, address, ownerId }) {
  const result = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at, updated_at`,
    [name, email || null, address || null, ownerId || null]
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await query(
    `SELECT id, name, email, address, owner_id, created_at, updated_at FROM stores WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function countAll() {
  const result = await query('SELECT COUNT(*)::int AS count FROM stores');
  return result.rows[0].count;
}

async function listStoresAdmin(filters = {}, sortOptions = {}, pagination = {}) {
  const conditions = [];
  const params = [];

  if (filters.name) {
    params.push(`%${filters.name}%`);
    conditions.push(`s.name ILIKE $${params.length}`);
  }
  if (filters.email) {
    params.push(`%${filters.email}%`);
    conditions.push(`s.email ILIKE $${params.length}`);
  }
  if (filters.address) {
    params.push(`%${filters.address}%`);
    conditions.push(`s.address ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { column, order } = parseSort(sortOptions.sortBy, sortOptions.sortOrder, STORE_SORT_COLUMNS);
  const sortColumn = column === 'average_rating' ? 'average_rating' : `s.${column}`;
  const { limit, offset, page } = parsePagination(pagination.page, pagination.limit);

  const countResult = await query(`SELECT COUNT(*)::int AS count FROM stores s ${where}`, params);
  const total = countResult.rows[0].count;

  params.push(limit, offset);
  const result = await query(
    `SELECT ${STORE_FIELDS},
            COALESCE(ROUND(AVG(r.value)::numeric, 2), 0) AS average_rating,
            COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY ${sortColumn} ${order}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { stores: result.rows, total, page, limit };
}

async function listStoresForUser(filters = {}, userId = null, pagination = {}) {
  const conditions = [];
  const params = [];

  if (filters.name) {
    params.push(`%${filters.name}%`);
    conditions.push(`s.name ILIKE $${params.length}`);
  }
  if (filters.address) {
    params.push(`%${filters.address}%`);
    conditions.push(`s.address ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { limit, offset, page } = parsePagination(pagination.page, pagination.limit);

  const countResult = await query(`SELECT COUNT(*)::int AS count FROM stores s ${where}`, params);
  const total = countResult.rows[0].count;

  const listParams = [...params];
  if (userId) listParams.push(userId);
  listParams.push(limit, offset);

  const userRatingSelect = userId
    ? `(SELECT value FROM ratings WHERE store_id = s.id AND user_id = $${params.length + 1}) AS user_rating`
    : 'NULL::int AS user_rating';

  const result = await query(
    `SELECT s.id, s.name, s.email, s.address, s.created_at,
            COALESCE(ROUND(AVG(r.value)::numeric, 2), 0) AS average_rating,
            COUNT(r.id)::int AS rating_count,
            ${userRatingSelect}
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY s.name ASC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return { stores: result.rows, total, page, limit };
}

async function findByIdWithRatings(id, userId = null) {
  const params = [id];
  let userRatingSql = 'NULL::int AS user_rating';
  if (userId) {
    params.push(userId);
    userRatingSql = `(SELECT value FROM ratings WHERE store_id = s.id AND user_id = $2) AS user_rating`;
  }

  const result = await query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            COALESCE(ROUND(AVG(r.value)::numeric, 2), 0) AS average_rating,
            COUNT(r.id)::int AS rating_count,
            ${userRatingSql}
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    params
  );
  return result.rows[0] || null;
}

async function findByOwnerId(ownerId) {
  const result = await query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);
  return result.rows[0] || null;
}

module.exports = {
  createStore,
  findById,
  countAll,
  listStoresAdmin,
  listStoresForUser,
  findByIdWithRatings,
  findByOwnerId,
};
