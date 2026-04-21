const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: String,
    address: String,
    phone1: String,
    phone2: String
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    size: String,
    color: String,
    image: String,
    quantity: Number
  }],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  promoCode: String,
  discount: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

let Order;
try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
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
  
  try {
    // GET /api/orders
    if (req.method === 'GET') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    
    // POST /api/orders
    if (req.method === 'POST') {
      const order = new Order(req.body);
      const newOrder = await order.save();
      return res.status(201).json(newOrder);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
