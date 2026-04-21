const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin (for initial setup only)
router.post('/create', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = new Admin({ email, password });
    await admin.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
