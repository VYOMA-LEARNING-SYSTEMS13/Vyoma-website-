/**
 * Deduplicate and format source citations from retrieved chunks
 */
function extractCitations(retrievedChunks) {
  if (!retrievedChunks || retrievedChunks.length === 0) return [];

  const seen = new Set();
  const citations = [];

  for (const chunk of retrievedChunks) {
    const title = chunk.title || chunk.metadata?.title || 'Company Document';
    const url = chunk.source_url || chunk.metadata?.source_url || null;
    const category = chunk.category || chunk.metadata?.category || 'general';

    const key = `${title}::${url || ''}::${category}`;
    if (!seen.has(key)) {
      seen.add(key);
      citations.push({
        title,
        url,
        category
      });
    }
  }

  return citations;
}

module.exports = {
  extractCitations
};
