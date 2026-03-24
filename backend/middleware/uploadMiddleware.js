// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure storage location and filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename(req, file, cb) {
    // Give the file a unique name using the current timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;