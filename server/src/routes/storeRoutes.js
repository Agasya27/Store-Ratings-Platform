const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.use(authenticate, requireRole('NORMAL'));

router.get('/', asyncHandler(storeController.listStores));
router.get('/:id', asyncHandler(storeController.getStore));

module.exports = router;
