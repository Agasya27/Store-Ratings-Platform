const AppError = require('../utils/AppError');
const ownerModel = require('../models/ownerModel');

async function getDashboard(req, res) {
  const store = await ownerModel.getOwnedStoreSummary(req.user.id);
  if (!store) {
    return res.json({
      store: null,
      raters: [],
      message: 'No store is assigned to this owner account yet.',
    });
  }

  const { sortBy, sortOrder } = req.query;
  const raters = await ownerModel.getRatersForOwner(req.user.id, { sortBy, sortOrder });
  res.json({ store, raters });
}

module.exports = { getDashboard };
