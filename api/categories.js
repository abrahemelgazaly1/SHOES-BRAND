const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { method, query } = req;
  
  try {
    switch (method) {
      case 'GET':
        const categories = await Category.find();
        return res.status(200).json(categories);
        
      case 'POST':
        const category = new Category(req.body);
        await category.save();
        return res.status(201).json(category);
        
      case 'DELETE':
        await Category.findByIdAndDelete(query.id);
        return res.status(200).json({ message: 'Category deleted' });
        
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
