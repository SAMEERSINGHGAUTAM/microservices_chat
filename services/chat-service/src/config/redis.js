const redis = require('redis');

// Redis client
let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('Chat Service Redis connected');
    });
    
    await redisClient.connect();
  } catch (error) {
    console.error('Chat Service Redis connection error:', error);
  }
};

module.exports = { redisClient, connectRedis };
