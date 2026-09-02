const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const {
  validateSignupBody,
  validateLoginBody,
  validateChangePasswordBody,
} = require('../utils/validators');
const { signToken } = require('../utils/token');
const userModel = require('../models/userModel');

async function signup(req, res) {
  const validation = validateSignupBody(req.body);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const { name, email, password, address } = req.body;
  const existing = await userModel.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({
    name,
    email,
    passwordHash,
    address,
    role: 'NORMAL',
  });

  const token = signToken(user);
  res.status(201).json({ token, user });
}

async function login(req, res) {
  const validation = validateLoginBody(req.body);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password', 401);

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new AppError('Invalid email or password', 401);

  const publicUser = userModel.toPublicUser(user);
  const token = signToken(publicUser);
  res.json({ token, user: publicUser });
}

async function logout(_req, res) {
  res.json({ message: 'Logged out successfully' });
}

async function changePassword(req, res) {
  const validation = validateChangePasswordBody(req.body);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const { currentPassword, newPassword } = req.body;
  const user = await userModel.findByIdWithPassword(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) throw new AppError('Current password is incorrect', 401);

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userModel.updatePassword(user.id, passwordHash);

  res.json({ message: 'Password updated successfully' });
}

async function me(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ user });
}

module.exports = { signup, login, logout, changePassword, me };
