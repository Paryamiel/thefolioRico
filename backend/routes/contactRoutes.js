const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitContact, getContacts, deleteContact } = require('../controllers/contactController');

// Public route to submit a form
router.post('/', submitContact);

// Admin routes
router.get('/', protect, getContacts);
router.delete('/:id', protect, deleteContact);

module.exports = router;