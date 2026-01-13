const express = require('express');

const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /dashboard/stats
 * Global admin dashboard stats + recent activity
 */
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const [
      teacherCount,
      courseCount,
      classCount,
      studentCount,
      parentCount,
      recentTeachers,
      recentCourses,
      recentClasses
    ] = await Promise.all([
      Teacher.countDocuments({ status: 'active' }),
      Course.countDocuments({ status: 'active' }),
      Class.countDocuments({ status: 'active' }),

      // students & parents are read-only/static
      Student.countDocuments(),
      Parent.countDocuments(),

      Teacher.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt'),

      Course.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('courseName classLevel createdAt'),

      Class.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('className classCode createdAt')
    ]);

    res.json({
      stats: {
        teachers: teacherCount,
        courses: courseCount,
        classes: classCount,
        students: studentCount,
        parents: parentCount
      },
      recentActivity: {
        teachers: recentTeachers,
        courses: recentCourses,
        classes: recentClasses
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /dashboard/activity/:type
 * Paginated recent activity by entity
 */
router.get('/activity/:type', authMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    let query;
    let select;

    switch (type) {
      case 'teachers':
        query = Teacher.find({ status: 'active' });
        select = 'name email createdAt';
        break;

      case 'courses':
        query = Course.find({ status: 'active' });
        select = 'courseName classLevel createdAt';
        break;

      case 'classes':
        query = Class.find({ status: 'active' });
        select = 'className classCode createdAt';
        break;

      default:
        return res.status(400).json({ message: 'Invalid activity type' });
    }

    const data = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(select);

    res.json({
      type,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
