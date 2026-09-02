const AppError = require('../utils/AppError');
const storeModel = require('../models/storeModel');

async function listStores(req, res) {
  const { name, address, page, limit } = req.query;
  const result = await storeModel.listStoresForUser(
    { name, address },
    req.user?.id || null,
    { page, limit }
  );
  res.json(result);
}

async function getStore(req, res) {
  const store = await storeModel.findByIdWithRatings(Number(req.params.id), req.user?.id || null);
  if (!store) throw new AppError('Store not found', 404);
  res.json({ store });
}

module.exports = { listStores, getStore };
