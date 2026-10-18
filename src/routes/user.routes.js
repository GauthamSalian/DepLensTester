const express = require('express');
const router = express.Router();
const {
  updateUser,
  getUserProperty,
  renderGreeting,
  groupUsersByRole,
  userDatabase
} = require('../services/user.service');
const {
  validateBody,
  profileUpdateSchema
} = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

// Get all users grouped by role
router.get('/by-role', (req, res) => {
  const grouped = groupUsersByRole();
  return res.json({ groups: grouped });
});

// Render dynamic greeting using lodash template
router.get('/greeting/:id', (req, res) => {
  const greeting = renderGreeting(req.params.id);
  return res.json({ greeting });
});

// Fetch user profile with specific nested property via lodash.get
router.get('/profile/:id', (req, res) => {
  const user = userDatabase.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const requestedPath = req.query.path || 'profile';
  const data = getUserProperty(req.params.id, requestedPath, null);
  return res.json({
    userId: req.params.id,
    path: requestedPath,
    data
  });
});

// Update user details with lodash.merge
router.put('/profile/:id', authenticateJWT, validateBody(profileUpdateSchema), (req, res) => {
  const updated = updateUser(req.params.id, req.validatedBody);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    message: 'User updated successfully',
    user: updated
  });
});

module.exports = router;
