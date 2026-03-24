// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { getAllUsers, toggleUserStatus } = require('../controllers/adminController');

// GET all users (Requires login AND Admin role)
router.get('/users', protect, adminOnly, getAllUsers);

// PUT update user status (Requires login AND Admin role)
router.put('/users/:id/status', protect, adminOnly, toggleUserStatus);

module.exports = router;