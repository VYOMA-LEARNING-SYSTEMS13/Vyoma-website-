const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateBody } = require('../middleware/validate.middleware');
const { chatRequestSchema } = require('../schemas/chat.schema');
const { chatRateLimiter } = require('../middleware/rateLimit.middleware');
const { handleChat, handleChatStream } = require('../controllers/chat.controller');

router.post('/', chatRateLimiter, validateBody(chatRequestSchema), asyncHandler(handleChat));
router.post('/stream', chatRateLimiter, validateBody(chatRequestSchema), asyncHandler(handleChatStream));

module.exports = router;
