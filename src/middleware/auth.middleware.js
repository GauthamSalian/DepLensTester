const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'deplens-super-secret-key-12345';
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcryptjs
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed password
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn, algorithm: 'HS256' });
};

/**
 * Decode JWT token without verification
 */
const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

/**
 * Express middleware to verify JWT in Authorization header
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format. Expected Bearer <token>' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    logger.warn(`JWT verification failed: ${err.message}`);
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  decodeToken,
  authenticateJWT,
  JWT_SECRET
};
