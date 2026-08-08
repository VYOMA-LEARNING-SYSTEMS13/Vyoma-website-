const { GoogleGenAI } = require('@google/genai');
const { env } = require('../config/env');
const logger = require('../config/logger');

let genAIClient = null;

function getGenAI() {
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY || 'placeholder_key' });
  }
  return genAIClient;
}

/**
 * Generate vector embedding for a single search query text using @google/genai
 */
async function embedQuery(text, maxRetries = 3) {
  const embeddingModel = (env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001').replace(/^models\//, '');
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      const ai = getGenAI();
      const result = await ai.models.embedContent({
        model: embeddingModel,
        contents: text,
        config: { outputDimensionality: 768 }
      });
      return result.embeddings[0].values;
    } catch (error) {
      const msg = String(error.message || error);

      if (attempt >= maxRetries) {
        logger.error({ err: msg, textSnippet: text.substring(0, 50) }, 'Error generating query embedding after max retries');
        throw error;
      }
      logger.warn({ attempt, maxRetries, err: msg }, 'embedQuery attempt failed, retrying...');
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
    }
  }
}

/**
 * Generate vector embeddings for an array of document chunks in batches with retries
 */
async function embedDocuments(textArray, batchSize = 10, maxRetries = 3) {
  const embeddingModel = (env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001').replace(/^models\//, '');
  const embeddings = [];
  const ai = getGenAI();

  for (let i = 0; i < textArray.length; i += batchSize) {
    const batch = textArray.slice(i, i + batchSize);

    for (const text of batch) {
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          attempt++;
          const result = await ai.models.embedContent({
            model: embeddingModel,
            contents: text,
            config: { outputDimensionality: 768 }
          });
          embeddings.push(result.embeddings[0].values);
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
