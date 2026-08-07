const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { handleHealthCheck, handleGetKnowledge, handleReindexKnowledge } = require('../controllers/knowledge.controller');
const { getOrCreateSession, getRecentMessages } = require('../services/conversation.service');
const { sendSuccess } = require('../utils/response');

// Health check
router.get('/health', asyncHandler(handleHealthCheck));

// Knowledge status
router.get('/knowledge', asyncHandler(handleGetKnowledge));
router.post('/knowledge/reindex', asyncHandler(handleReindexKnowledge));

// Session endpoints
router.post('/session', asyncHandler(async (req, res) => {
  const { sessionId, visitorId } = req.body;
  const session = await getOrCreateSession(sessionId, visitorId);
  return sendSuccess(res, { session });
}));

router.get('/session/:id/messages', asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  const messages = await getRecentMessages(sessionId, 50);
  return sendSuccess(res, { messages });
}));

module.exports = router;
