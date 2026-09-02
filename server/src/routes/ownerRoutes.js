const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const ownerController = require('../controllers/ownerController');

const router = express.Router();

router.use(authenticate, requireRole('OWNER'));

router.get('/dashboard', asyncHandler(ownerController.getDashboard));

module.exports = router;
