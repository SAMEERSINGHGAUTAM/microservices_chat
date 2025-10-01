const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken } = require('./jwt.service');

// Register a new user
const registerUser = async (username, email, password) => {
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Create user
  const user = new User({
    username,
    email,
    password: hashedPassword
  });
  
  // Save user
  await user.save();
  
  return user;
};

// Login user
const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  
  if (!user) {
    return null;
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return { user, accessToken, refreshToken };
};

// Validate user token
const validateUserToken = async (token) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Find user
    const user = await User.findById(decoded.id);
    
    return user;
  } catch (error) {
    return null;
  }
};

// Refresh user token
const refreshUserToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return { accessToken: null, refreshToken: null };
    }
    
    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return { accessToken: null, refreshToken: null };
  }
};

module.exports = {
  registerUser,
  loginUser,
  validateUserToken,
  refreshUserToken
};
