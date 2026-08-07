const { sendError } = require('../utils/response');

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return sendError(res, errorMessage, 'CHATBOT_VALIDATION_ERROR', 400);
    }
    req.validatedBody = result.data;
    next();
  };
}

module.exports = {
  validateBody
};
