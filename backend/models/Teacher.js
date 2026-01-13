const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
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

    profileImage: {
      type: String,
      default: null
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      match: [/^\d{10}$/, 'Invalid phone number']
    },

    subjects: {
      type: [String],
      default: []
    },

    joiningDate: {
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

module.exports = mongoose.model('Teacher', teacherSchema);
