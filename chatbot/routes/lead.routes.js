const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateBody } = require('../middleware/validate.middleware');
const { leadRequestSchema } = require('../schemas/lead.schema');
const { chatRateLimiter } = require('../middleware/rateLimit.middleware');
const { handleCreateLead } = require('../controllers/lead.controller');

router.post('/', chatRateLimiter, validateBody(leadRequestSchema), asyncHandler(handleCreateLead));

module.exports = router;
