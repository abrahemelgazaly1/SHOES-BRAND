const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');

// Create promo code
router.post('/create', async (req, res) => {
  try {
    const { code, discount, validDays, maxUses } = req.body;
    
    const daysToMs = {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '10': 10,
      '14': 14,
      '30': 30,
      '60': 60
    };
    
    const days = daysToMs[validDays] || parseInt(validDays);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discount: parseInt(discount),
      validDays: days,
      maxUses: parseInt(maxUses),
      expiresAt
    });
    
    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all promo codes
router.get('/', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    
    if (!promoCode) {
      return res.status(404).json({ valid: false, message: 'Invalid promo code' });
    }
    
    if (!promoCode.isActive) {
      return res.status(400).json({ valid: false, message: 'Promo code is inactive' });
    }
    
    if (new Date() > promoCode.expiresAt) {
      return res.status(400).json({ valid: false, message: 'Promo code has expired' });
    }
    
    if (promoCode.currentUses >= promoCode.maxUses) {
      return res.status(400).json({ valid: false, message: 'Promo code usage limit reached' });
    }
    
    res.json({ valid: true, discount: promoCode.discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use promo code
router.post('/use', async (req, res) => {
  try {
    const { code } = req.body;
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }
    
    promoCode.currentUses += 1;
    await promoCode.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete promo code
router.delete('/:id', async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
