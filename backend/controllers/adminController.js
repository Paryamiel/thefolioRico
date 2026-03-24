// controllers/adminController.js
const User = require('../models/User');

// --- GET ALL USERS ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// --- TOGGLE USER STATUS ---
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle the boolean
    user.isActive = !user.isActive; 
    await user.save();

    res.status(200).json({ message: `User is now ${user.isActive ? 'Active' : 'Deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};