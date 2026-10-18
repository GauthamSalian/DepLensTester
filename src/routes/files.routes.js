const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const { upload, uploadDir } = require('../middleware/upload.middleware');
const logger = require('../config/logger');

// Upload single file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file rejected by filter' });
  }

  logger.info(`File uploaded successfully: ${req.file.filename}`);
  return res.status(201).json({
    message: 'File uploaded successfully',
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      destination: req.file.destination
    }
  });
});

// Inspect file metadata
router.get('/meta', (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter is required' });
  }

  const detectedMime = mime.lookup(filename) || 'application/octet-stream';
  const detectedExt = mime.extension(detectedMime) || path.extname(filename);

  return res.json({
    filename,
    detectedMime,
    detectedExt,
    isCommonWebFormat: ['image/jpeg', 'image/png', 'application/json'].includes(detectedMime)
  });
});

module.exports = router;
