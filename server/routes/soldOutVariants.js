const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Toggle sold out for specific size
router.put('/size/:productId', async (req, res) => {
  try {
    const { size } = req.body;
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const soldOutSizes = product.soldOutSizes || [];
    const index = soldOutSizes.indexOf(size);
    
    if (index > -1) {
      // Remove from sold out
      soldOutSizes.splice(index, 1);
    } else {
      // Add to sold out
      soldOutSizes.push(size);
    }
    
    product.soldOutSizes = soldOutSizes;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle sold out for specific color
router.put('/color/:productId', async (req, res) => {
  try {
    const { color } = req.body;
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const soldOutColors = product.soldOutColors || [];
    const index = soldOutColors.indexOf(color);
    
    if (index > -1) {
      // Remove from sold out
      soldOutColors.splice(index, 1);
    } else {
      // Add to sold out
      soldOutColors.push(color);
    }
    
    product.soldOutColors = soldOutColors;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
