const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.post('/change-password', authenticate, asyncHandler(authController.changePassword));
router.get('/me', authenticate, asyncHandler(authController.me));

module.exports = router;
