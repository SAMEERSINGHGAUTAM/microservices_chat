const User = require('../models/user.model');
const { registerUser, loginUser, validateUserToken, refreshUserToken } = require('../services/auth.service');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    // Register user
    const user = await registerUser(username, email, password);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Login user
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Validate token
const validateToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Validate token
    const user = await validateUserToken(token);
    
    if (!user) {
      return res.status(200).json({ valid: false });
    }
    
    res.status(200).json({
      valid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(200).json({ valid: false });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;
    
    // Refresh token
    const { accessToken, refreshToken: newRefreshToken } = await refreshUserToken(oldRefreshToken);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    res.status(200).json({
      tokens: {
        access: accessToken,
        refresh: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // In a real implementation, we would invalidate the refresh token
    // For now, we'll just send a success response
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = {
  register,
  login,
  validateToken,
  refreshToken,
  logout
};
