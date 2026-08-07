const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

const chatRateLimiter = rateLimit({
  windowMs: env.CHATBOT_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.CHATBOT_RATE_LIMIT_MAX || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'CHATBOT_RATE_LIMIT_EXCEEDED',
        message: 'Too many chatbot requests. Please wait a few minutes before trying again.'
      }
    });
  }
});

module.exports = {
  chatRateLimiter
};
