const redis = require('redis');
const { redisClient } = require('../config/redis.config');

// Rate limiter middleware
const rateLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate-limit:${ip}`;
  const window = 60; // 60 seconds
  const limit = 100; // 100 requests per window
  
  try {
    // Get current count from Redis
    let count = await redisClient.get(key);
    
    if (count === null) {
      // First request in window, set key with expiration
      await redisClient.setex(key, window, 1);
      count = 1;
    } else {
      count = parseInt(count);
      if (count >= limit) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      // Increment count
      await redisClient.incr(key);
    }
    
    // Set rate limit headers
    res.set('X-RateLimit-Limit', limit);
    res.set('X-RateLimit-Remaining', limit - count);
    
    next();
  } catch (error) {
    console.error('Rate limiter error:', error.message);
    // If Redis is down, we skip rate limiting
    next();
  }
};

module.exports = { rateLimiter };
