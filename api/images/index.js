const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../../server/config/cloudinary');
const streamifier = require('streamifier');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'legcy-sneakers' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Upload failed', error });
        }
        res.json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'legcy-sneakers' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete image
router.delete('/delete', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Image URL required' });
    }

    // Extract public_id from Cloudinary URL
    const urlParts = url.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `legcy-sneakers/${publicIdWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;
