const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },

    classEnrolled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
      index: true
    },

    enrollmentDate: {
      type: Date,
      default: Date.now
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

module.exports = mongoose.model('Student', studentSchema);
