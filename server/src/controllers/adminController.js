const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { validateAdminUserBody, validateStoreBody } = require('../utils/validators');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

async function demoteOwnerIfNoStores(ownerId) {
  const owner = await userModel.findById(ownerId);
  if (!owner || owner.role !== 'OWNER') return;

  const remainingStore = await storeModel.findByOwnerId(ownerId);
  if (!remainingStore) {
    await userModel.updateRole(ownerId, 'NORMAL');
  }
}

async function getDashboard(_req, res) {
  const [users, stores, ratings] = await Promise.all([
    userModel.countAll(),
    storeModel.countAll(),
    ratingModel.countAll(),
  ]);
  res.json({ users, stores, ratings });
}

async function createUser(req, res) {
  const validation = validateAdminUserBody(req.body);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const { name, email, password, address, role } = req.body;
  const existing = await userModel.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ name, email, passwordHash, address, role });
  res.status(201).json({ user });
}

async function createStore(req, res) {
  const validation = validateStoreBody(req.body);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const { name, email, address, ownerId } = req.body;
  if (!ownerId) throw new AppError('A store owner is required.', 400);

  const owner = await userModel.findById(ownerId);
  if (!owner) throw new AppError('Owner user not found', 404);
  if (owner.role !== 'OWNER') await userModel.updateRole(ownerId, 'OWNER');

  const store = await storeModel.createStore({ name, email, address, ownerId });
  res.status(201).json({ store });
}

async function deleteStore(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError('Invalid store id', 400);

  const store = await storeModel.findById(id);
  if (!store) throw new AppError('Store not found', 404);

  const ownerId = store.owner_id;
  await storeModel.deleteById(id);
  if (ownerId) await demoteOwnerIfNoStores(ownerId);

  res.json({ message: 'Store deleted successfully' });
}

async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError('Invalid user id', 400);

  if (id === req.user.id) throw new AppError('You cannot delete your own account', 400);

  const user = await userModel.findById(id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'ADMIN') throw new AppError('Admin accounts cannot be deleted', 400);

  await userModel.deleteById(id);
  res.json({ message: 'User deleted successfully' });
}

async function listUsers(req, res) {
  const { name, email, address, role, sortBy, sortOrder, page, limit } = req.query;
  const result = await userModel.listUsers(
    { name, email, address, role },
    { sortBy, sortOrder },
    { page, limit }
  );
  res.json(result);
}

async function listStores(req, res) {
  const { name, email, address, sortBy, sortOrder, page, limit } = req.query;
  const result = await storeModel.listStoresAdmin(
    { name, email, address },
    { sortBy, sortOrder },
    { page, limit }
  );
  res.json(result);
}

async function getUserById(req, res) {
  const detail = await userModel.findDetailById(Number(req.params.id));
  if (!detail) throw new AppError('User not found', 404);
  res.json(detail);
}

module.exports = {
  getDashboard,
  createUser,
  createStore,
  deleteStore,
  deleteUser,
  listUsers,
  listStores,
  getUserById,
};
