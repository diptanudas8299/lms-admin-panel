const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true
    },

    classCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true
    },

    courseLinked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },

    teacherAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
      index: true
    },

    schedule: {
      day: {
        type: String,
       enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        required: true
      },
      time: {
        type: String,
        required: true
      }
    },

    maxStudents: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
