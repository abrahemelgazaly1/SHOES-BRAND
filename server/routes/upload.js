const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test Cloudinary connection
router.get('/test', (req, res) => {
  const config = cloudinary.config();
  res.json({
    configured: !!(config.cloud_name && config.api_key && config.api_secret),
    cloud_name: config.cloud_name,
    has_api_key: !!config.api_key,
    has_api_secret: !!config.api_secret
  });
});

// Upload images to Cloudinary
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('Files count:', req.files?.length);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        console.log(`Uploading file ${index + 1}...`);
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'legcy-sneakers' },
          (error, result) => {
            if (error) {
              console.error(`❌ Upload failed for file ${index + 1}:`, error);
              reject(error);
            } else {
              console.log(`✅ File ${index + 1} uploaded:`, result.secure_url);
              resolve(result.secure_url);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log('✅ All files uploaded successfully');
    res.json({ urls: imageUrls });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete image from Cloudinary
router.delete('/', async (req, res) => {
  try {
    const { url } = req.body;
    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
