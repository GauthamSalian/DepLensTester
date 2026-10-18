const express = require('express');
const router = express.Router();
const {
  createUser,
  authenticateUser
} = require('../services/user.service');
const {
  generateToken,
  decodeToken,
  authenticateJWT
} = require('../middleware/auth.middleware');
const {
  validateBody,
  registerSchema
} = require('../middleware/validation.middleware');
const logger = require('../config/logger');

// Register user
router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const user = await createUser(req.validatedBody);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    logger.warn(`Registration failed: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return res.json({
    message: 'Login successful',
    user,
    token
  });
});

// Get current user profile from verified JWT
router.get('/me', authenticateJWT, (req, res) => {
  return res.json({
    authenticatedUser: req.user
  });
});

// Inspect / decode token without verifying signature
router.post('/decode', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  const decoded = decodeToken(token);
  return res.json({ decoded });
});

module.exports = router;
