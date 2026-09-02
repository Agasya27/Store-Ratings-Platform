const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.use(authenticate, requireRole('NORMAL'));

router.post('/', asyncHandler(ratingController.submitRating));
router.put('/:storeId', asyncHandler(ratingController.updateRating));

module.exports = router;
