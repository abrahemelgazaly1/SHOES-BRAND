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
    // Extract id from URL path: /api/sold-out/product/[id]
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];
    
    try {
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      product.isSoldOut = !product.isSoldOut;
      
      await product.save();
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
};
