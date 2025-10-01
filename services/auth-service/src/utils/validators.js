// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

// Validate username format
const validateUsername = (username) => {
  // Between 3 and 30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername
};
