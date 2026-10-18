const validator = require('validator');
const { z } = require('zod');

// Schema definitions using Zod
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'user', 'guest']).optional().default('user')
});

const profileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  website: z.string().optional(),
  bio: z.string().max(300).optional()
});

/**
 * Sanitize and validate string inputs using validator library
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  const trimmed = validator.trim(input);
  return validator.escape(trimmed);
};

/**
 * Validate email format with validator
 */
const isValidEmail = (email) => {
  return typeof email === 'string' && validator.isEmail(email);
};

/**
 * Validate URL with validator
 */
const isValidUrl = (url) => {
  return typeof url === 'string' && validator.isURL(url, { require_protocol: true });
};

/**
 * Middleware factory for Zod validation
 */
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }
  req.validatedBody = result.data;
  return next();
};

module.exports = {
  registerSchema,
  profileUpdateSchema,
  sanitizeInput,
  isValidEmail,
  isValidUrl,
  validateBody
};
