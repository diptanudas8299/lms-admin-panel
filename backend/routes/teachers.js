const express = require('express');
const mongoose = require('mongoose');

const Teacher = require('../models/Teacher');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * GET /teachers
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { search, subject, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const query = { status: 'active' };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    if (subject) {
      query.subjects = { $in: [subject.toLowerCase()] };
    }

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Teacher.countDocuments(query)
    ]);

    res.json({
      teachers,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /teachers
 */
router.post(
  '/',
  authMiddleware,
  upload.single('profileImage'),
  async (req, res, next) => {
    try {
      const { name, email, phoneNumber, subjects, status } = req.body;

      if (!name || !email || !phoneNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let parsedSubjects = [];
      if (subjects) {
        parsedSubjects = Array.isArray(subjects)
          ? subjects
          : JSON.parse(subjects);
      }

      const teacher = new Teacher({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        subjects: parsedSubjects.map(s => s.toLowerCase()),
        status: status || 'active',
        profileImage: req.file ? `/uploads/${req.file.filename}` : null
      });

      await teacher.save();

      res.status(201).json({
        message: 'Teacher created successfully',
        teacher
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /teachers/:id
 */
router.put(
  '/:id',
  authMiddleware,
  upload.single('profileImage'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid teacher id' });
      }

      const teacher = await Teacher.findById(id);
      if (!teacher || teacher.status !== 'active') {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      if (req.body.name) teacher.name = req.body.name.trim();
      if (req.body.email) teacher.email = req.body.email.trim().toLowerCase();
      if (req.body.phoneNumber) teacher.phoneNumber = req.body.phoneNumber.trim();
      if (req.body.status) teacher.status = req.body.status;

      if (req.body.subjects) {
        teacher.subjects = Array.isArray(req.body.subjects)
          ? req.body.subjects
          : JSON.parse(req.body.subjects);
      }

      if (req.file) {
        teacher.profileImage = `/uploads/${req.file.filename}`;
      }

      await teacher.save();

      res.json({
        message: 'Teacher updated successfully',
        teacher
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /teachers/:id (soft delete)
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid teacher id' });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher archived successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
