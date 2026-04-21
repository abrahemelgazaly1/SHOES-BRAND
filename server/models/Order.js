const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone1: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
      required: true,
    },
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: String,
    color: String,
    image: String,
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 120,
  },
  total: {
    type: Number,
    required: true,
  },
  promoCode: {
    type: String,
    default: null,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
