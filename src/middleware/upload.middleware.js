const multer = require('multer');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype) || path.extname(file.originalname).replace('.', '');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

// File filter checking allowed mime types
const fileFilter = (req, file, cb) => {
  const detectedType = mime.lookup(file.originalname);
  const allowed = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'application/json'];

  if (allowed.includes(file.mimetype) || (detectedType && allowed.includes(detectedType))) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter
});

module.exports = {
  upload,
  uploadDir
};
