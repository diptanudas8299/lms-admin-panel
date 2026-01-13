const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB Connected Successfully');

    mongoose.connection.on('error', err => {
      console.error('MongoDB runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
