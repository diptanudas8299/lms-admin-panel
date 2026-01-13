const express = require('express');
const mongoose = require('mongoose');

const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * GET /api/courses
 * Search + filters + pagination
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { search, classLevel, subject, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const query = { status: 'active' };

    if (search) {
      query.courseName = { $regex: search, $options: 'i' };
    }

    if (classLevel) {
      query.classLevel = classLevel;
    }

    if (subject) {
      query.subject = subject.trim().toLowerCase();
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('teacherAssigned', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Course.countDocuments(query)
    ]);

    res.json({
      courses,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/courses/:id
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findOne({
      _id: id,
      status: 'active'
    }).populate('teacherAssigned', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/courses
 */
router.post(
  '/',
  authMiddleware,
  upload.single('thumbnail'),
  async (req, res, next) => {
    try {
      const {
        courseName,
        classLevel,
        subject,
        description,
        price,
        durationInWeeks,
        teacherAssigned
      } = req.body;

      if (
        !courseName ||
        !classLevel ||
        !subject ||
        !description ||
        !durationInWeeks ||
        !teacherAssigned
      ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!mongoose.Types.ObjectId.isValid(teacherAssigned)) {
        return res.status(400).json({ message: 'Invalid teacher id' });
      }

      const teacher = await Teacher.findOne({
        _id: teacherAssigned,
        status: 'active'
      });

      if (!teacher) {
        return res.status(400).json({
          message: 'Teacher not found or inactive'
        });
      }

      const courseData = {
        courseName: courseName.trim(),
        classLevel,
        subject: subject.trim().toLowerCase(),
        description: description.trim(),
        price: price || 0,
        durationInWeeks,
        teacherAssigned
      };

      if (req.file) {
        courseData.thumbnail = `/uploads/${req.file.filename}`;
      }

      const course = await Course.create(courseData);

      const populatedCourse = await Course.findById(course._id)
        .populate('teacherAssigned', 'name email');

      res.status(201).json({
        message: 'Course created successfully',
        course: populatedCourse
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/courses/:id
 */
router.put(
  '/:id',
  authMiddleware,
  upload.single('thumbnail'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid course id' });
      }

      const course = await Course.findById(id);
      if (!course || course.status !== 'active') {
        return res.status(404).json({ message: 'Course not found' });
      }

      const allowedUpdates = [
        'courseName',
        'description',
        'price',
        'durationInWeeks',
        'status'
      ];

      allowedUpdates.forEach((key) => {
        if (req.body[key] !== undefined) {
          course[key] = req.body[key];
        }
      });

      if (req.file) {
        course.thumbnail = `/uploads/${req.file.filename}`;
      }

      await course.save();

      const populatedCourse = await Course.findById(course._id)
        .populate('teacherAssigned', 'name email');

      res.json({
        message: 'Course updated successfully',
        course: populatedCourse
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/courses/:id (soft delete)
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course archived successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
