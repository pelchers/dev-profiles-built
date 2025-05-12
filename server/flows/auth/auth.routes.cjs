const express = require('express');
const { AuthController } = require('./auth.controller.cjs');
const { authenticateJWT } = require('../../common/middleware/auth.middleware.cjs');
const { authLimiter } = require('../../common/middleware/rate-limit.middleware.cjs');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Register new user
router.post('/register', AuthController.register);

// Login user
router.post('/login', AuthController.login);

// Refresh token
router.post('/refresh-token', AuthController.refreshToken);

// Logout user (requires authentication)
router.post('/logout', authenticateJWT, AuthController.logout);

module.exports = router; 