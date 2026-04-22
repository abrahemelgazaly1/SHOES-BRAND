const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  validDays: { type: Number, required: true },
  maxUses: { type: Number, required: true },
  currentUses: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

let PromoCode;
try {
  PromoCode = mongoose.model('PromoCode');
} catch {
  PromoCode = mongoose.model('PromoCode', promoCodeSchema);
}

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = connection;
  return connection;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Extract action from query or URL
  const { action, id } = req.query;
  const path = req.url ? req.url.split('?')[0] : '';
  
  // GET /api/promo-codes - Get all promo codes
  if (req.method === 'GET' && !action) {
    try {
      const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
      return res.json(promoCodes);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // POST /api/promo-codes?action=create - Create new promo code
  if (req.method === 'POST' && (action === 'create' || path.includes('/create'))) {
    try {
      const { code, discount, validDays, maxUses } = req.body;
      
      const daysToMs = { 
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
        '10': 10, '14': 14, '30': 30, '60': 60 
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
      return res.status(201).json(promoCode);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // POST /api/promo-codes?action=validate - Validate promo code
  if (req.method === 'POST' && (action === 'validate' || path.includes('/validate'))) {
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
      
      return res.json({ valid: true, discount: promoCode.discount });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // POST /api/promo-codes?action=use - Use promo code
  if (req.method === 'POST' && (action === 'use' || path.includes('/use'))) {
    try {
      const { code } = req.body;
      const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
      
      if (!promoCode) {
        return res.status(404).json({ message: 'Invalid promo code' });
      }
      
      promoCode.currentUses += 1;
      await promoCode.save();
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // DELETE /api/promo-codes?id=xxx - Delete promo code
  if (req.method === 'DELETE' && (id || path.includes('/api/promo-codes/'))) {
    try {
      const promoId = id || path.split('/').pop();
      await PromoCode.findByIdAndDelete(promoId);
      return res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  return res.status(404).json({ message: 'Route not found' });
};
