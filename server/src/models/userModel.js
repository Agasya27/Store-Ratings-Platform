const { query } = require('../config/db');

const PUBLIC_FIELDS = 'id, name, email, address, role, created_at, updated_at';

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
  toPublicUser,
};
