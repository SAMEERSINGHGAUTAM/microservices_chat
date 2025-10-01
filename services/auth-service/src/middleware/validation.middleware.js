const { validateEmail, validatePassword, validateUsername } = require('../utils/validators');

// Validate registration input
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  // Check if all required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  
  // Validate username
  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  
  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if all required fields are present
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};
