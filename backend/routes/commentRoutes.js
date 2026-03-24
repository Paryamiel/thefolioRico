const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


const { addComment, deleteComment, getComments, getAllComments } = require('../controllers/commentController');

// GET all comments across the site (Admin Only)
router.get('/', protect, getAllComments);

// GET comments for a specific post (Public)
router.get('/:postId', getComments);

// POST a comment (Members/Admins only)
router.post('/', protect, addComment);

// DELETE a comment
router.delete('/:id', protect, deleteComment);

module.exports = router;