const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Toggle product sold out
router.put('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isSoldOut = !product.isSoldOut;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle size sold out
router.put('/size/:id', async (req, res) => {
  try {
    const { size } = req.body;
    const product = await Product.findById(req.params.id);
    
    const index = product.soldOutSizes.indexOf(size);
    if (index > -1) {
      product.soldOutSizes.splice(index, 1);
    } else {
      product.soldOutSizes.push(size);
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle color sold out
router.put('/color/:id', async (req, res) => {
  try {
    const { color } = req.body;
    const product = await Product.findById(req.params.id);
    
    const index = product.soldOutColors.indexOf(color);
    if (index > -1) {
      product.soldOutColors.splice(index, 1);
    } else {
      product.soldOutColors.push(color);
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
