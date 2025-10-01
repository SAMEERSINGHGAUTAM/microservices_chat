const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`Auth Service MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Auth Service database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
