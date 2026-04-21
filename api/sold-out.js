const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  colors: [{ type: String, required: true }],
  isBestSeller: { type: Boolean, default: false },
  isSoldOut: { type: Boolean, default: false },
  soldOutSizes: [{ type: String }],
  soldOutColors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

let Product;
try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', productSchema);
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
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'PUT') {
    const { product } = req.query;
    
    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    try {
      const productDoc = await Product.findById(product);
      
      if (!productDoc) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      productDoc.isSoldOut = !productDoc.isSoldOut;
      
      await productDoc.save();
      return res.json(productDoc);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
};
