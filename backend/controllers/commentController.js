// controllers/commentController.js
const Comment = require('../models/Comment');

// --- GET COMMENTS FOR A POST --- (Public)
exports.getComments = async (req, res) => {
  try {
    // Find all comments where the 'post' ID matches the URL parameter
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: 1 }); // 1 puts oldest comments at the top (standard format)
    
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// --- ADD A COMMENT --- (Members & Admins)
exports.addComment = async (req, res) => {
  try {
    const { text, postId } = req.body;

    const newComment = new Comment({
      text,
      post: postId,
      author: req.user.id || req.user._id // Added fallback just in case
    });

    const savedComment = await newComment.save();
    
    // Populate the author data before sending it back to React so it displays instantly!
    const populatedComment = await savedComment.populate('author', 'name profilePicture');

    res.status(201).json({ message: 'Comment added successfully!', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// --- DELETE A COMMENT --- (Author or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user is the author OR an Admin
    if (comment.author.toString() !== (req.user.id || req.user._id).toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment.' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// --- GET ALL COMMENTS GLOBALLY --- (Admin Only)
exports.getAllComments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    
    // Fetch all comments, get author details, and get the post title
    const comments = await Comment.find()
      .populate('author', 'name profilePicture')
      .populate('post', 'title') 
      .sort({ createdAt: -1 });
      
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all comments', error: error.message });
  }
};