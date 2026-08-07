const { z } = require('zod');

const feedbackRequestSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
  messageId: z.string().optional().nullable(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional().nullable()
});

module.exports = {
  feedbackRequestSchema
};
