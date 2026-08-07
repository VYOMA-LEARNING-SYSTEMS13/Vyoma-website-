const { embedQuery } = require('../services/embedding.service');
const { retrieveSimilarChunks } = require('../services/retrieval.service');
const logger = require('../config/logger');

/**
 * Search company vector knowledge base for a text query
 */
async function searchKnowledgeBase(queryText, options = {}) {
  try {
    const queryEmbedding = await embedQuery(queryText);
    const chunks = await retrieveSimilarChunks({
      queryEmbedding,
      topK: options.topK,
      minSimilarity: options.minSimilarity,
      category: options.category
    });

    return chunks;
  } catch (error) {
    logger.error({ err: error, queryText }, 'Error in searchKnowledgeBase retriever');
    return [];
  }
}

module.exports = {
  searchKnowledgeBase
};
