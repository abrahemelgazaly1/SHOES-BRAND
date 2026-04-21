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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  
  try {
    // GET /api/orders/[id]
    if (req.method === 'GET') {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    }
    
    // PUT /api/orders/[id]
    if (req.method === 'PUT') {
      const order = await Order.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true }
      );
      return res.json(order);
    }
    
    // DELETE /api/orders/[id]
    if (req.method === 'DELETE') {
      await Order.findByIdAndDelete(id);
      return res.json({ message: 'Order deleted' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
