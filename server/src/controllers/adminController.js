const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { validateAdminUserBody, validateStoreBody } = require('../utils/validators');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

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
  if (ownerId) {
    const owner = await userModel.findById(ownerId);
    if (!owner) throw new AppError('Owner user not found', 404);
    if (owner.role !== 'OWNER') await userModel.updateRole(ownerId, 'OWNER');
  }

  const store = await storeModel.createStore({ name, email, address, ownerId });
  res.status(201).json({ store });
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

module.exports = { getDashboard, createUser, createStore, listUsers, listStores, getUserById };
