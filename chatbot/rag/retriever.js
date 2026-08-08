const { embedQuery } = require('../services/embedding.service');
const { retrieveSimilarChunks } = require('../services/retrieval.service');
const logger = require('../config/logger');

/**
 * Search company vector knowledge base for a text query
 */
async function searchKnowledgeBase(queryText, options = {}) {
  try {
    console.log(`3️⃣  GENERATING VECTOR EMBEDDING (text-embedding-004)...`);
    const queryEmbedding = await embedQuery(queryText);
    
    if (queryEmbedding && Array.isArray(queryEmbedding)) {
      const sample = queryEmbedding.slice(0, 5).map((n) => Number(n).toFixed(4)).join(', ');
      console.log(`    ├─ Vector Dimension: ${queryEmbedding.length}-D`);
      console.log(`    └─ Vector Sample: [ ${sample}, ... ]`);
    }

    console.log(`4️⃣  SEARCHING SUPABASE PGVECTOR (HNSW Cosine Similarity)...`);
    const chunks = await retrieveSimilarChunks({
      queryEmbedding,
      topK: options.topK,
      minSimilarity: options.minSimilarity,
      category: options.category
    });

    if (chunks && chunks.length > 0) {
      console.log(`    └─ Matched ${chunks.length} Top Knowledge Chunks:`);
      chunks.forEach((c, idx) => {
        const score = ((c.similarity || 0) * 100).toFixed(1);
        console.log(`       [Rank ${idx + 1}] Similarity: ${score}% | Source: "${c.title || 'Doc'}" (${c.category || 'general'})`);
        console.log(`       Snippet: "${(c.content || '').substring(0, 90).replace(/\n/g, ' ')}..."`);
      });
    } else {
      console.log(`    └─ ⚠️ No matching chunks found above threshold.`);
    }

    return chunks;
  } catch (error) {
    logger.error({ err: error, queryText }, 'Error in searchKnowledgeBase retriever');
    return [];
  }
}

module.exports = {
  searchKnowledgeBase
};
