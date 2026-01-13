const express = require('express');
const mongoose = require('mongoose');

const Class = require('../models/Class');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /classes
 * Filters + Pagination
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    let { course, teacher, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const query = { status: 'active' };

    if (course) {
      if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({ message: 'Invalid course id' });
      }
      query.courseLinked = course;
    }

    if (teacher) {
      if (!mongoose.Types.ObjectId.isValid(teacher)) {
        return res.status(400).json({ message: 'Invalid teacher id' });
      }
      query.teacherAssigned = teacher;
    }

    const [classes, total] = await Promise.all([
      Class.find(query)
        .populate('courseLinked', 'courseName classLevel')
        .populate('teacherAssigned', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Class.countDocuments(query)
    ]);

    res.json({
      classes,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /classes/:id
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid class id' });
    }

    const classData = await Class.findOne({
      _id: id,
      status: 'active'
    })
      .populate('courseLinked')
      .populate('teacherAssigned');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /classes
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      className,
      classCode,
      courseLinked,
      teacherAssigned,
      schedule,
      maxStudents
    } = req.body;

    if (
      !className ||
      !classCode ||
      !courseLinked ||
      !teacherAssigned ||
      !schedule ||
      !maxStudents
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseLinked) ||
      !mongoose.Types.ObjectId.isValid(teacherAssigned)
    ) {
      return res.status(400).json({ message: 'Invalid course or teacher id' });
    }

    const course = await Course.findOne({
      _id: courseLinked,
      status: 'active'
    });

    if (!course) {
      return res.status(400).json({ message: 'Course not found or inactive' });
    }

    const teacher = await Teacher.findOne({
      _id: teacherAssigned,
      status: 'active'
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found or inactive' });
    }

    const classData = await Class.create({
      className,
      classCode,
      courseLinked,
      teacherAssigned,
      schedule,
      maxStudents,
      status: 'active'
    });

    const populatedClass = await Class.findById(classData._id)
      .populate('courseLinked')
      .populate('teacherAssigned');

    res.status(201).json({
      message: 'Class created successfully',
      class: populatedClass
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /classes/:id
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid class id' });
    }

    const classData = await Class.findById(id);
    if (!classData || classData.status !== 'active') {
      return res.status(404).json({ message: 'Class not found' });
    }

    const allowedUpdates = [
      'className',
      'schedule',
      'maxStudents'
    ];

    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        classData[key] = req.body[key];
      }
    });

    if (req.body.teacherAssigned) {
      if (!mongoose.Types.ObjectId.isValid(req.body.teacherAssigned)) {
        return res.status(400).json({ message: 'Invalid teacher id' });
      }

      const teacher = await Teacher.findOne({
        _id: req.body.teacherAssigned,
        status: 'active'
      });

      if (!teacher) {
        return res.status(400).json({
          message: 'Teacher not found or inactive'
        });
      }

      classData.teacherAssigned = req.body.teacherAssigned;
    }

    await classData.save();

    const populatedClass = await Class.findById(classData._id)
      .populate('courseLinked')
      .populate('teacherAssigned');

    res.json({
      message: 'Class updated successfully',
      class: populatedClass
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /classes/:id
 * Soft delete
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid class id' });
    }

    const classData = await Class.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class archived successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
