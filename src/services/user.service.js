const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../middleware/auth.middleware');
const { isValidEmail } = require('../middleware/validation.middleware');
const logger = require('../config/logger');

// In-memory store for demonstration / testing purposes
const userDatabase = new Map();

/**
 * Create a new user with secure password hashing and unique UUID
 */
const createUser = async (userData) => {
  if (!isValidEmail(userData.email)) {
    throw new Error('Invalid email address provided');
  }

  const existing = Array.from(userDatabase.values()).find((u) => u.email === userData.email);
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(userData.password);
  const userId = uuidv4();

  const newUser = {
    id: userId,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'user',
    profile: {
      fullName: userData.fullName || '',
      theme: 'dark',
      notificationsEnabled: true
    },
    tags: ['new-user'],
    createdAt: new Date().toISOString()
  };

  userDatabase.set(userId, newUser);
  logger.info(`Created user id: ${userId} (${newUser.username})`);

  // Return user without password using lodash omit
  return _.omit(newUser, ['password']);
};

/**
 * Update user details using lodash deep merge and clone
 */
const updateUser = (userId, updates) => {
  const user = userDatabase.get(userId);
  if (!user) {
    return null;
  }

  // Deep clone existing record
  const cloned = _.cloneDeep(user);

  // Filter allowed update keys
  const safeUpdates = _.pick(updates, ['username', 'profile', 'tags']);

  // Merge updates deeply into user object
  const merged = _.merge(cloned, safeUpdates);

  if (updates.tags && Array.isArray(updates.tags)) {
    merged.tags = _.uniq([...cloned.tags, ...updates.tags]);
  }

  userDatabase.set(userId, merged);
  return _.omit(merged, ['password']);
};

/**
 * Safe property extractor using lodash get
 */
const getUserProperty = (userId, path, defaultValue = null) => {
  const user = userDatabase.get(userId);
  if (!user) return defaultValue;
  return _.get(user, path, defaultValue);
};

/**
 * Generate personalized greeting using lodash template
 */
const renderGreeting = (userId) => {
  const user = userDatabase.get(userId);
  if (!user) return 'Hello, Guest!';

  const templateStr = 'Hello <%= username %>! Welcome to DepLens Benchmark (<%= role %> mode).';
  const compiled = _.template(templateStr);
  return compiled({ username: user.username, role: user.role });
};

/**
 * Find user by email and verify password
 */
const authenticateUser = async (email, plainPassword) => {
  const user = Array.from(userDatabase.values()).find((u) => u.email === email);
  if (!user) {
    return null;
  }

  const isMatch = await comparePassword(plainPassword, user.password);
  if (!isMatch) {
    return null;
  }

  return _.omit(user, ['password']);
};

/**
 * Group users by role using lodash groupBy
 */
const groupUsersByRole = () => {
  const allUsers = Array.from(userDatabase.values()).map((u) => _.omit(u, ['password']));
  return _.groupBy(allUsers, 'role');
};

module.exports = {
  createUser,
  updateUser,
  getUserProperty,
  renderGreeting,
  authenticateUser,
  groupUsersByRole,
  userDatabase
};
