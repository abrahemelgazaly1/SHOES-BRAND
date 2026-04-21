const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true
  },
  validDays: {
    type: Number,
    required: true
  },
  maxUses: {
    type: Number,
    required: true
  },
  currentUses: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PromoCode', promoCodeSchema);
