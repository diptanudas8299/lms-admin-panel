const express = require('express');
const mongoose = require('mongoose');

const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /students
 * Admin: list students with search + pagination (read-only)
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { search, classId, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const query = { status: 'active' };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    if (classId) {
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: 'Invalid class id' });
      }
      query.classEnrolled = classId;
    }

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate('classEnrolled', 'className classCode')
        .populate('parent', 'name email phone')
        .select('name email classEnrolled parent createdAt')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),

      Student.countDocuments(query)
    ]);

    res.json({
      students,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /students/:id
 * Admin: get single student (read-only)
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student id' });
    }

    const student = await Student.findOne({
      _id: id,
      status: 'active'
    })
      .populate('classEnrolled', 'className classCode')
      .populate('parent', 'name email phone')
      .select('name email classEnrolled parent createdAt');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
