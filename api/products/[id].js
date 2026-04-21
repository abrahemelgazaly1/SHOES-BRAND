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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  
  try {
    // GET /api/products/[id]
    if (req.method === 'GET') {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
    
    // PUT /api/products/[id]
    if (req.method === 'PUT') {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(product);
    }
    
    // DELETE /api/products/[id]
    if (req.method === 'DELETE') {
      await Product.findByIdAndDelete(id);
      return res.json({ message: 'Product deleted' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
