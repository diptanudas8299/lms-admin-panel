const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully'
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// ----------------------------------------
// ✅ Login Admin
// ----------------------------------------
router.post('/login', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin
      .findOne({ email: normalizedEmail })
      .select('+password role status');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Admin account inactive' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
