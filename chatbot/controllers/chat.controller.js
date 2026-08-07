const { processChatMessage, processStreamingChatMessage } = require('../services/rag.service');
const { sanitizeInput } = require('../utils/sanitize');
const { sendSuccess } = require('../utils/response');
const logger = require('../config/logger');

/**
 * POST /api/chatbot/chat
 */
async function handleChat(req, res) {
  const { message, sessionId, visitorId } = req.body;
  const cleanMessage = sanitizeInput(message);

  const result = await processChatMessage({
    message: cleanMessage,
    sessionId,
    visitorId
  });

  return sendSuccess(res, result);
}

/**
 * POST /api/chatbot/chat/stream
 * Server-Sent Events (SSE) streaming endpoint
 */
async function handleChatStream(req, res) {
  const { message, sessionId, visitorId } = req.body;
  const cleanMessage = sanitizeInput(message);

  // Set SSE response headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent('start', { status: 'starting' });

    const result = await processStreamingChatMessage({
      message: cleanMessage,
      sessionId,
      visitorId,
      onToken: (token) => {
        sendEvent('token', { token });
      },
      onSources: (sources) => {
        sendEvent('sources', { sources });
      }
    });

    sendEvent('done', {
      sessionId: result.sessionId,
      messageId: result.messageId
    });

    res.end();
  } catch (err) {
    logger.error({ err: err.message }, 'SSE Stream failed');
    sendEvent('error', { error: 'Failed to generate answer stream' });
    res.end();
  }
}

module.exports = {
  handleChat,
  handleChatStream
};
