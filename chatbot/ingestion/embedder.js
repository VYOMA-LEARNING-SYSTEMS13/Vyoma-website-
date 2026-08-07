const { embedDocuments } = require('../services/embedding.service');
const logger = require('../config/logger');

/**
 * Generate vector embeddings for a list of chunk objects
 */
async function embedChunkList(chunkObjects) {
  if (!chunkObjects || chunkObjects.length === 0) return [];

  const textList = chunkObjects.map((c) => c.content);
  logger.info({ chunkCount: textList.length }, 'Generating vector embeddings for chunks');

  const vectorList = await embedDocuments(textList);

  return chunkObjects.map((chunk, index) => ({
    ...chunk,
    embedding: vectorList[index]
  }));
}

module.exports = {
  embedChunkList
};
