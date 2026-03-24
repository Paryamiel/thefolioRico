// controllers/postController.js
const Post = require('../models/Post');

// --- GET ALL POSTS --- (Public)
exports.getPosts = async (req, res) => {
  try {
    // FIX: Changed 'fullname' to 'name profilePicture' so the React PostCard works!
    const posts = await Post.find().populate('author', 'name profilePicture').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// --- CREATE A POST --- (Members & Admins)
exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imagePath = '';

    // If an Admin uploads an image, save the path
    if (req.file) {
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only Admins can upload post images.' });
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newPost = new Post({
      title,
      description,
      author: req.user.id || req.user._id, // Added a fallback just in case
      image: imagePath
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// --- DELETE A POST --- (Author or Admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the user is the author OR an Admin
    if (post.author.toString() !== (req.user.id || req.user._id).toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};