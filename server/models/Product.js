const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  fakePrice: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Shoes', 'Accessories'],
  },
  images: [{
    type: String,
    required: true,
  }],
  sizes: [{
    type: String,
  }],
  colors: [{
    type: String,
  }],
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isSoldOut: {
    type: Boolean,
    default: false,
  },
  soldOutSizes: [{
    type: String,
  }],
  soldOutColors: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
