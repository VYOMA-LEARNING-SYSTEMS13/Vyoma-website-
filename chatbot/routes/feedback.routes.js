const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validateBody } = require('../middleware/validate.middleware');
const { feedbackRequestSchema } = require('../schemas/feedback.schema');
const { handleCreateFeedback } = require('../controllers/feedback.controller');

router.post('/', validateBody(feedbackRequestSchema), asyncHandler(handleCreateFeedback));

module.exports = router;
