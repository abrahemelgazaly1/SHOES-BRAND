const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
// زيادة حد الـ payload لاستقبال الصور Base64 (100MB)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (Attempt ${i}/${maxRetries})...`);
      
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/legcy-sneakers', {
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
      });
      
      console.log('✅ MongoDB connected successfully!');
      return;
    } catch (err) {
      console.error(`❌ Connection failed (Attempt ${i}/${maxRetries}):`, err.message);
      
      if (i === maxRetries) {
        console.error('🚨 Failed to connect to MongoDB after all attempts!');
        console.error('Please check:');
        console.error('1. Add your IP in MongoDB Atlas (0.0.0.0/0 to allow all IPs)');
        console.error('2. Verify the connection string in .env file');
        console.error('3. Check your internet connection');
        process.exit(1);
      }
      
      console.log(`⏳ Waiting ${retryDelay/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Start connection
connectDB();

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/promo-codes', require('./routes/promoCodes'));
app.use('/api/sold-out', require('./routes/soldOut'));
app.use('/api/sold-out-variants', require('./routes/soldOutVariants'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/images', require('../api/images/index'));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
