const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// We will create this controller in the next step!
const { createPost, getPosts, deletePost } = require('../controllers/postController'); 

// GET all posts (Guests can view)
router.get('/', getPosts);

// POST a new post (Members/Admins only) - optionally accepts an image uploaded by Admin
router.post('/', protect, upload.single('image'), createPost);

// DELETE a post (Members can delete their own, Admin can delete any)
router.delete('/:id', protect, deletePost);

module.exports = router;