const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// 2. Configure where and how to save files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to public/uploads
  },
  filename: (req, file, cb) => {
    // Create unique filename: photo-timestamp-random.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'photo-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// 3. Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error(`Only images are allowed. You uploaded: ${file.mimetype}`));
  }
};

// 4. Multer configuration with limits
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Max 10 files per upload
  },
  fileFilter: fileFilter
});

// 5. Middleware to handle uploads with error handling
const uploadPhotos = (req, res, next) => {
  upload.array('photos', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'FILE_TOO_LARGE') {
        return res.render('trips/create', {
          title: 'Add New Trip',
          trip: req.body,
          errors: ['File too large. Maximum size is 10MB.']
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.render('trips/create', {
          title: 'Add New Trip',
          trip: req.body,
          errors: ['Maximum 10 photos allowed.']
        });
      }
      return res.render('trips/create', {
        title: 'Add New Trip',
        trip: req.body,
        errors: [err.message]
      });
    }
    if (err) {
      // Other errors
      return res.render('trips/create', {
        title: 'Add New Trip',
        trip: req.body,
        errors: [err.message]
      });
    }
    next();
  });
};

module.exports = { upload, uploadPhotos };
