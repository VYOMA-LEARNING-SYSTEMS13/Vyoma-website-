const { z } = require('zod');
const logger = require('./logger');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5001'),
  
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  GEMINI_EMBEDDING_MODEL: z.string().default('text-embedding-004'),
  
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  
  CHATBOT_TOP_K: z.coerce.number().default(5),
  CHATBOT_MIN_SIMILARITY: z.coerce.number().default(0.5),
  CHATBOT_MAX_HISTORY: z.coerce.number().default(10),
  
  CHATBOT_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 mins
  CHATBOT_RATE_LIMIT_MAX: z.coerce.number().default(100)
});

let parsedEnv = {};

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    logger.warn('⚠️ Environment variable validation warnings:');
    result.error.issues.forEach((issue) => {
      logger.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    // Return parsed fallback / partial values
    parsedEnv = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '5001',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      CHATBOT_TOP_K: Number(process.env.CHATBOT_TOP_K) || 5,
      CHATBOT_MIN_SIMILARITY: Number(process.env.CHATBOT_MIN_SIMILARITY) || 0.5,
      CHATBOT_MAX_HISTORY: Number(process.env.CHATBOT_MAX_HISTORY) || 10,
      CHATBOT_RATE_LIMIT_WINDOW_MS: Number(process.env.CHATBOT_RATE_LIMIT_WINDOW_MS) || 900000,
      CHATBOT_RATE_LIMIT_MAX: Number(process.env.CHATBOT_RATE_LIMIT_MAX) || 100
    };
  } else {
    logger.info('✅ Chatbot environment variables validated successfully');
    parsedEnv = result.data;
  }
  return parsedEnv;
}

module.exports = {
  validateEnv,
  get env() {
    return parsedEnv.GEMINI_API_KEY ? parsedEnv : validateEnv();
  }
};
