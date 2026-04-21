const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
};

// Routes
app.use('/api/products', require('../server/routes/products'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/categories', require('../server/routes/categories'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/promo-codes', require('../server/routes/promoCodes'));
app.use('/api/sold-out', require('../server/routes/soldOut'));
app.use('/api/sold-out-variants', require('../server/routes/soldOutVariants'));
app.use('/api/upload', require('../server/routes/upload'));
app.use('/api/images', require('./images/index'));

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'City Fragrance API' });
});

// Serverless function handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
