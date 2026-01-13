const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true
    },

    classLevel: {
      type: String,
      enum: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      required: true,
      index: true
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      default: 0,
      min: 0
    },

    durationInWeeks: {
      type: Number,
      required: true,
      min: 1
    },

    teacherAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
      index: true
    },

    thumbnail: {
      type: String,
      default: null
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

module.exports = mongoose.model('Course', courseSchema);
