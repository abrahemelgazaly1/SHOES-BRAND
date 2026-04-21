const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  isBestSeller: { type: Boolean, default: false },
  isSoldOut: { type: Boolean, default: false },
  soldOutSizes: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

let Product;
try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', ProductSchema);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, id, bestseller } = req.query;
  
  try {
    // GET /api/products?category=Men
    if (req.method === 'GET' && category) {
      const products = await Product.find({ category }).sort({ createdAt: -1 });
      return res.json(products);
    }
    
    // GET /api/products?bestseller=true
    if (req.method === 'GET' && bestseller) {
      const products = await Product.find({ isBestSeller: true }).limit(8);
      return res.json(products);
    }
    
    // GET /api/products - Get all
    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    }
    
    // POST /api/products - Create
    if (req.method === 'POST') {
      const product = new Product(req.body);
      const newProduct = await product.save();
      return res.status(201).json(newProduct);
    }
    
    // PUT /api/products?bestseller=id - Toggle bestseller
    if (req.method === 'PUT' && bestseller) {
      const product = await Product.findById(bestseller);
      
      if (product.isBestSeller) {
        product.isBestSeller = false;
      } else {
        const bestSellersCount = await Product.countDocuments({ isBestSeller: true });
        if (bestSellersCount >= 8) {
          return res.status(400).json({ message: 'Maximum 8 best sellers allowed' });
        }
        product.isBestSeller = true;
      }
      
      await product.save();
      return res.json(product);
    }
    
    return res.status(400).json({ message: 'Invalid request' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
