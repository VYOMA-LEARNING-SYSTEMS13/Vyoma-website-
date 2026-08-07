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
async function getEmbeddingModel(ai) {
  const configuredName = (env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004').replace(/^models\//, '');
  const candidateModels = [configuredName, 'gemini-embedding-001', 'embedding-001'];

  for (const mName of candidateModels) {
    try {
      const model = ai.getGenerativeModel({ model: mName });
      // Test small embed ping to ensure model works
      await model.embedContent('ping test');
      logger.info({ workingEmbeddingModel: mName }, 'Successfully initialized working embedding model');
      return { model, modelName: mName };
    } catch (err) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        logger.warn({ failedModel: mName }, 'Embedding model 404, trying next fallback model...');
        continue;
      }
      // If it's another error (like auth/network), throw immediately
      throw err;
    }
  }

  // Fallback to configured model if all checks fail
  return { model: ai.getGenerativeModel({ model: configuredName }), modelName: configuredName };
}

let cachedWorkingModel = null;

async function getActiveModel(ai) {
  if (!cachedWorkingModel) {
    const res = await getEmbeddingModel(ai);
    cachedWorkingModel = res.model;
  }
  return cachedWorkingModel;
}

/**
 * Generate vector embedding for a single search query text
 */
async function embedQuery(text) {
  try {
    const ai = getGenAI();
    const model = await getActiveModel(ai);
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text }] },
      outputDimensionality: 768
    });
    return result.embedding.values;
  } catch (error) {
    logger.error({ err: error.message, textSnippet: text.substring(0, 50) }, 'Error generating query embedding');
    throw error;
  }
}

/**
 * Generate vector embeddings for an array of document chunks in batches with retries
 */
async function embedDocuments(textArray, batchSize = 10, maxRetries = 3) {
  const embeddings = [];
  const ai = getGenAI();
  const model = await getActiveModel(ai);

  for (let i = 0; i < textArray.length; i += batchSize) {
    const batch = textArray.slice(i, i + batchSize);
    
    for (const text of batch) {
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          attempt++;
          const result = await model.embedContent({
            content: { role: 'user', parts: [{ text }] },
            outputDimensionality: 768
          });
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
