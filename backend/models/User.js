// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Guest', 'Member', 'Admin'], 
    default: 'Member' 
  },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  isActive: { type: Boolean, default: true } // Admin can toggle this
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);