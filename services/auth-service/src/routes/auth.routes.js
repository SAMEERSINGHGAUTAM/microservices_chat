const express = require('express');
const router = express.Router();

const { register, login, validateToken, refreshToken, logout } = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');

// Auth routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/validate', validateToken);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;
