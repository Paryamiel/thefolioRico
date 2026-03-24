// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER A NEW USER ---
exports.register = async (req, res) => {
  try {
    // UPDATED: Changed 'fullname' to 'name' to match our database changes
    const { name, email, password, role } = req.body;

    // 1. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    const newUser = new User({
      name, // UPDATED: using name here
      email,
      password: hashedPassword,
      role: role || 'Member' // Default to Member if not provided
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// --- LOGIN A USER ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2. Check if the account is active (Admin feature from rubric)
    if (!user.isActive && user.isActive !== undefined) {
      return res.status(403).json({ message: 'Account has been deactivated. Contact Admin.' });
    }

    // 3. Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Generate the JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 5. Send back the token and user data (excluding password)
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name || user.fullname, // Added fallback just in case of old accounts
        email: user.email,
        role: user.role,
        bio: user.bio,                    // <-- ADDED THIS! Now React will remember the bio
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// --- GET ALL USERS --- (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    // Security check: Only Admins can do this
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    
    // Fetch all users but hide their passwords!
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// --- DELETE A USER --- (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};