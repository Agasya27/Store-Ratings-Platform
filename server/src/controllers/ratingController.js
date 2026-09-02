const AppError = require('../utils/AppError');
const { validateRatingValue } = require('../utils/validators');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

async function submitRating(req, res) {
  const validation = validateRatingValue(req.body.value);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const storeId = Number(req.body.storeId);
  if (!storeId) throw new AppError('storeId is required', 400);

  const store = await storeModel.findById(storeId);
  if (!store) throw new AppError('Store not found', 404);

  const rating = await ratingModel.upsertRating(req.user.id, storeId, Number(req.body.value));
  res.status(201).json({ rating });
}

async function updateRating(req, res) {
  const validation = validateRatingValue(req.body.value);
  if (!validation.valid) throw new AppError(validation.error, 400);

  const storeId = Number(req.params.storeId);
  const store = await storeModel.findById(storeId);
  if (!store) throw new AppError('Store not found', 404);

  const existing = await ratingModel.findByUserAndStore(req.user.id, storeId);
  if (!existing) throw new AppError('Rating not found. Submit a rating first.', 404);

  const rating = await ratingModel.upsertRating(req.user.id, storeId, Number(req.body.value));
  res.json({ rating });
}

module.exports = { submitRating, updateRating };
