const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// API routes are handled through proxy middleware in server.js

module.exports = router;
