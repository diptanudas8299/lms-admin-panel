const express = require('express');
const mongoose = require('mongoose');

const Parent = require('../models/Parent');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /parents
 * Search + pagination (read-only)
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const query = { status: 'active' };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [parents, total] = await Promise.all([
      Parent.find(query)
        .populate({
          path: 'students',
          match: { status: 'active' },
          select: 'name email'
        })
        .select('name email phone students createdAt')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),

      Parent.countDocuments(query)
    ]);

    res.json({
      parents,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /parents/:id
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid parent id' });
    }

    const parent = await Parent.findOne({
      _id: id,
      status: 'active'
    })
      .populate({
        path: 'students',
        match: { status: 'active' },
        select: 'name email classEnrolled'
      })
      .select('name email phone students createdAt');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.json(parent);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
