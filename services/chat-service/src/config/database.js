const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-service', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`Chat Service MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Chat Service database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
