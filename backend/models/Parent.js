const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      match: [/^\d{10}$/, 'Invalid phone number']
    },

    students: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student'
        }
      ],
      default: []
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

module.exports = mongoose.model('Parent', parentSchema);
