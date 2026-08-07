const { cleanText } = require('./cleaner');

/**
 * Split text into semantic chunks with overlap while preserving structured metadata
 */
function createChunks({ text, chunkSizeChars = 3000, overlapChars = 500, metadata = {} }) {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const chunks = [];

  // Check if text appears to be an FAQ list or structured section
  const lines = cleaned.split('\n');
  let currentChunk = '';
  let chunkIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if ((currentChunk.length + line.length + 1) > chunkSizeChars && currentChunk.trim().length > 0) {
      chunks.push({
        chunk_index: chunkIndex++,
        content: currentChunk.trim(),
        token_count: Math.ceil(currentChunk.trim().length / 4),
        metadata: {
          ...metadata,
          chunk_index: chunkIndex
        }
      });

      // Keep overlap from end of previous chunk
      const overlapStart = Math.max(0, currentChunk.length - overlapChars);
      currentChunk = currentChunk.substring(overlapStart) + '\n' + line;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n' + line : line;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      chunk_index: chunkIndex++,
      content: currentChunk.trim(),
      token_count: Math.ceil(currentChunk.trim().length / 4),
      metadata: {
        ...metadata,
        chunk_index: chunkIndex
      }
    });
  }

  return chunks;
}

module.exports = {
  createChunks
};
