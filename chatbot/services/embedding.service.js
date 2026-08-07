const { GoogleGenerativeAI } = require('@google/generative-ai');
const { env } = require('../config/env');
const logger = require('../config/logger');

let genAIClient = null;

function getGenAI() {
  if (!genAIClient) {
    genAIClient = new GoogleGenerativeAI(env.GEMINI_API_KEY || 'placeholder_key');
  }
  return genAIClient;
}

/**
 * Generate vector embedding for a single search query text
 */
async function embedQuery(text) {
  try {
    const ai = getGenAI();
    const modelName = env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
    const model = ai.getGenerativeModel({ model: modelName });

    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    logger.error({ err: error, textSnippet: text.substring(0, 50) }, 'Error generating query embedding');
    throw error;
  }
}

/**
 * Generate vector embeddings for an array of document chunks in batches with retries
 */
async function embedDocuments(textArray, batchSize = 10, maxRetries = 3) {
  const embeddings = [];
  const ai = getGenAI();
  const modelName = env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
  const model = ai.getGenerativeModel({ model: modelName });

  for (let i = 0; i < textArray.length; i += batchSize) {
    const batch = textArray.slice(i, i + batchSize);
    
    for (const text of batch) {
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          attempt++;
          const result = await model.embedContent(text);
          embeddings.push(result.embedding.values);
          success = true;
        } catch (err) {
          logger.warn({ attempt, maxRetries, err: err.message }, 'Embedding attempt failed, retrying...');
          if (attempt >= maxRetries) {
            logger.error({ textSnippet: text.substring(0, 50) }, 'Failed to generate document embedding after retries');
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  return embeddings;
}

module.exports = {
  embedQuery,
  embedDocuments
};
