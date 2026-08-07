const { z } = require('zod');

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message text is required').max(4000, 'Message text exceeds 4000 characters limit'),
  sessionId: z.string().optional().nullable(),
  visitorId: z.string().optional().nullable()
});

module.exports = {
  chatRequestSchema
};
