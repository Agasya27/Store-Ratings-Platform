const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', asyncHandler(adminController.getDashboard));
router.get('/users', asyncHandler(adminController.listUsers));
router.post('/users', asyncHandler(adminController.createUser));
router.get('/users/:id', asyncHandler(adminController.getUserById));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));
router.get('/stores', asyncHandler(adminController.listStores));
router.post('/stores', asyncHandler(adminController.createStore));
router.delete('/stores/:id', asyncHandler(adminController.deleteStore));

module.exports = router;
