const { z } = require('zod');

const leadRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address format'),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  requirement: z.string().optional().nullable(),
  sessionId: z.string().optional().nullable()
});

module.exports = {
  leadRequestSchema
};
