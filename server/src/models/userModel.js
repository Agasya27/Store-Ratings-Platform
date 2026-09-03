const { query } = require('../config/db');
const { parsePagination, parseSort } = require('../utils/queryHelpers');

const PUBLIC_FIELDS = 'id, name, email, address, role, created_at, updated_at';
const USER_SORT_COLUMNS = ['name', 'email', 'address', 'role', 'created_at'];

async function findByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findByIdWithPassword(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createUser({ name, email, passwordHash, address, role }) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_FIELDS}`,
    [name, email, passwordHash, address || null, role]
  );
  return result.rows[0];
}

async function updatePassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
}

async function updateRole(id, role) {
  await query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
}

async function countAll() {
  const result = await query('SELECT COUNT(*)::int AS count FROM users');
  return result.rows[0].count;
}

async function listUsers(filters = {}, sortOptions = {}, pagination = {}) {
  const conditions = [];
  const params = [];

  if (filters.name) {
    params.push(`%${filters.name}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }
  if (filters.email) {
    params.push(`%${filters.email}%`);
    conditions.push(`email ILIKE $${params.length}`);
  }
  if (filters.address) {
    params.push(`%${filters.address}%`);
    conditions.push(`address ILIKE $${params.length}`);
  }
  if (filters.role) {
    params.push(filters.role);
    conditions.push(`role = $${params.length}`);
  } else {
    conditions.push(`role IN ('NORMAL', 'ADMIN')`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { column, order } = parseSort(sortOptions.sortBy, sortOptions.sortOrder, USER_SORT_COLUMNS);
  const { limit, offset, page } = parsePagination(pagination.page, pagination.limit);

  const countResult = await query(`SELECT COUNT(*)::int AS count FROM users ${where}`, params);
  const total = countResult.rows[0].count;

  params.push(limit, offset);
  const result = await query(
    `SELECT ${PUBLIC_FIELDS}
     FROM users ${where}
     ORDER BY ${column} ${order}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { users: result.rows, total, page, limit };
}

async function findDetailById(id) {
  const userResult = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  const user = userResult.rows[0];
  if (!user) return null;

  if (user.role !== 'OWNER') return { user };

  const storeResult = await query(
    `SELECT s.id, s.name,
            COALESCE(ROUND(AVG(r.value)::numeric, 2), 0) AS average_rating,
            COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [id]
  );

  return { user, ownedStore: storeResult.rows[0] || null };
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

module.exports = {
  findByEmail,
  findById,
  findByIdWithPassword,
  createUser,
  updatePassword,
  updateRole,
  countAll,
  listUsers,
  findDetailById,
  toPublicUser,
};
