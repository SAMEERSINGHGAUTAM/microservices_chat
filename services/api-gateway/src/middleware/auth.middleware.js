const axios = require('axios');
const { SERVICES } = require('../config/services.config');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  try {
    // Validate token with auth service
    const response = await axios.post(`${SERVICES.AUTH}/api/v1/auth/validate`, {
      token
    });
    
    if (response.data.valid) {
      req.user = response.data.user;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { authMiddleware };
