const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error({
    err: {
      message: err.message,
      stack: err.stack
    },
    url: req.originalUrl,
    method: req.method
  }, 'Unhandled Chatbot API Error');

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'CHATBOT_INTERNAL_ERROR';
  const errorMessage = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Unable to process your request. Please try again later.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage
    }
  });
}

module.exports = {
  errorHandler
};
