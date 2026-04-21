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
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = connection;
  return connection;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    try {
      const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
      return res.json(promoCodes);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  if (req.method === 'POST') {
    const { action, code, discount, validDays, maxUses } = req.body;
    
    try {
      if (action === 'create') {
        const daysToMs = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '10': 10, '14': 14, '30': 30, '60': 60 };
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
      }
      
      if (action === 'validate') {
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
      }
      
      if (action === 'use') {
        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
        
        if (!promoCode) {
          return res.status(404).json({ message: 'Invalid promo code' });
        }
        
        promoCode.currentUses += 1;
        await promoCode.save();
        
        return res.json({ success: true });
      }
      
      return res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
};
