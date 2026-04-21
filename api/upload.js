const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'city-fragrance' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const chunks = [];
      
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      
      const buffer = Buffer.concat(chunks);
      const result = await uploadToCloudinary(buffer);
      
      return res.json({ urls: [result.secure_url] });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { url } = req.body;
      const publicId = url.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
};
