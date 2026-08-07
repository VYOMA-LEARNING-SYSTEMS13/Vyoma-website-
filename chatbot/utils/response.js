function sendSuccess(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function sendError(res, message = 'Unable to process your request.', code = 'CHATBOT_ERROR', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendSuccess,
  sendError
};
