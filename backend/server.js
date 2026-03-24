// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Import contact routes

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
// cors() allows your React app (running on a different port) to make requests to this API
app.use(cors()); 
// express.json() allows the server to accept JSON data in the request body
app.use(express.json()); 
// Serve the 'uploads' folder statically so the frontend can access images
app.use('/uploads', express.static('uploads')); 

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', require('./routes/contactRoutes'));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('TheFolio API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    
    // Start the server only after connecting to the database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });