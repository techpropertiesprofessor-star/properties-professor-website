const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { auth, adminOnly } = require('../middleware/auth');
const {
  uploadToSpaces,
  uploadMultipleToSpaces,
  deleteFromSpaces,
  deleteMultipleFromSpaces,
  extractKeyFromUrl,
  getFileTypeInfo,
  DO_SPACES_CDN_URL,
} = require('../config/digitalocean');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { isValid, type } = getFileTypeInfo(file.mimetype);
  if (isValid) {
    file.fileType = type;
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: images, videos, PDFs.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max (for videos)
    files: 20, // Max 20 files at once
  },
});

// @route   POST /api/media/upload
// @desc    Upload a single file
// @access  Private (Admin)
router.post('/upload', auth, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = req.body.folder || 'general';
    let fileBuffer = req.file.buffer;

    // Optimize images (resize and compress)
    if (req.file.fileType === 'image' && req.file.mimetype !== 'image/svg+xml') {
      const maxWidth = parseInt(req.body.maxWidth) || 1920;
      const quality = parseInt(req.body.quality) || 85;

      fileBuffer = await sharp(req.file.buffer)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .jpeg({ quality, progressive: true })
        .toBuffer();
    }

    const result = await uploadToSpaces(
      fileBuffer,
      req.file.originalname,
      folder,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        originalName: req.file.originalname,
        size: fileBuffer.length,
        type: req.file.fileType,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/media/upload-multiple
// @desc    Upload multiple files
// @access  Private (Admin)
router.post('/upload-multiple', auth, adminOnly, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = req.body.folder || 'general';
    const results = [];

    for (const file of req.files) {
      let fileBuffer = file.buffer;

      // Optimize images
      if (file.fileType === 'image' && file.mimetype !== 'image/svg+xml') {
        const maxWidth = parseInt(req.body.maxWidth) || 1920;
        const quality = parseInt(req.body.quality) || 85;

        fileBuffer = await sharp(file.buffer)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .jpeg({ quality, progressive: true })
          .toBuffer();
      }

      const result = await uploadToSpaces(
        fileBuffer,
        file.originalname,
        folder,
        file.mimetype
      );

      results.push({
        url: result.url,
        key: result.key,
        originalName: file.originalname,
        size: fileBuffer.length,
        type: file.fileType,
        mimeType: file.mimetype,
      });
    }

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: results,
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/media/upload-property-images
// @desc    Upload property images with thumbnails
// @access  Private (Admin)
router.post('/upload-property-images', auth, adminOnly, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const propertyId = req.body.propertyId || 'temp';
    const folder = `properties/${propertyId}`;
    const results = [];

    for (const file of req.files) {
      if (file.fileType !== 'image') {
        continue; // Skip non-images
      }

      // Generate optimized main image
      const mainBuffer = await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      // Generate thumbnail
      const thumbBuffer = await sharp(file.buffer)
        .resize({ width: 400, height: 300, fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload main image
      const mainResult = await uploadToSpaces(mainBuffer, file.originalname, folder, 'image/jpeg');

      // Upload thumbnail
      const thumbName = `thumb_${file.originalname}`;
      const thumbResult = await uploadToSpaces(thumbBuffer, thumbName, `${folder}/thumbnails`, 'image/jpeg');

      results.push({
        url: mainResult.url,
        key: mainResult.key,
        thumbnail: thumbResult.url,
        thumbnailKey: thumbResult.key,
        originalName: file.originalname,
        isPrimary: results.length === 0, // First image is primary
      });
    }

    res.json({
      success: true,
      message: `${results.length} property images uploaded successfully`,
      data: results,
    });
  } catch (error) {
    console.error('Property images upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/media/upload-video
// @desc    Upload a video file
// @access  Private (Admin)
router.post('/upload-video', auth, adminOnly, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video uploaded' });
    }

    if (req.file.fileType !== 'video') {
      return res.status(400).json({ success: false, message: 'File must be a video' });
    }

    const folder = req.body.folder || 'videos';
    
    const result = await uploadToSpaces(
      req.file.buffer,
      req.file.originalname,
      folder,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        originalName: req.file.originalname,
        size: req.file.buffer.length,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/media/delete
// @desc    Delete a file from storage
// @access  Private (Admin)
router.delete('/delete', auth, adminOnly, async (req, res) => {
  try {
    const { key, url } = req.body;
    
    // Extract key from URL if key not provided directly
    const fileKey = key || extractKeyFromUrl(url);
    
    if (!fileKey) {
      return res.status(400).json({ success: false, message: 'File key or URL required' });
    }

    const success = await deleteFromSpaces(fileKey);

    if (success) {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete file' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/media/delete-multiple
// @desc    Delete multiple files from storage
// @access  Private (Admin)
router.delete('/delete-multiple', auth, adminOnly, async (req, res) => {
  try {
    const { keys, urls } = req.body;
    
    let fileKeys = keys || [];
    
    // Extract keys from URLs if provided
    if (urls && urls.length > 0) {
      const extractedKeys = urls.map(extractKeyFromUrl).filter(Boolean);
      fileKeys = [...fileKeys, ...extractedKeys];
    }
    
    if (fileKeys.length === 0) {
      return res.status(400).json({ success: false, message: 'No file keys or URLs provided' });
    }

    const results = await deleteMultipleFromSpaces(fileKeys);
    const successCount = results.filter(Boolean).length;

    res.json({
      success: true,
      message: `Deleted ${successCount} of ${fileKeys.length} files`,
      data: { deleted: successCount, total: fileKeys.length },
    });
  } catch (error) {
    console.error('Multiple delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/media/cdn-url
// @desc    Get the CDN URL base
// @access  Public
router.get('/cdn-url', (req, res) => {
  res.json({
    success: true,
    data: { cdnUrl: DO_SPACES_CDN_URL },
  });
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files' });
    }
  }
  if (error.message) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next(error);
});

module.exports = router;
