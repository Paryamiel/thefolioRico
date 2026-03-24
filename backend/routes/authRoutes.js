const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, deleteUser } = require('../controllers/authController');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// --- 1. IMPORT YOUR CUSTOM UPLOAD MIDDLEWARE ---
const upload = require('../middleware/uploadMiddleware');

// Existing Auth Routes
router.post('/register', register);
router.post('/login', login);

// --- 2. PROFILE UPDATE ROUTE ---
// Notice how clean this is now! We just use 'upload.single("profilePic")'
// Change the upload.single string to 'profilePicture'
router.put('/profile', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    // 1. Change fullname to name
    const { name, bio } = req.body;
    let updateFields = { name, bio };

    // 2. Change profilePic to profilePicture
    if (req.file) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`;
      console.log("Image successfully saved at:", updateFields.profilePicture); 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id, 
      { $set: updateFields },
      { new: true } 
    ).select('-password'); 

    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

// --- ADMIN ROUTES ---
// GET all users
router.get('/', protect, getAllUsers);
// DELETE a user
router.delete('/:id', protect, deleteUser);

module.exports = router;