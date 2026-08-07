const { getSupabaseClient } = require('../config/supabase');
const { env } = require('../config/env');
const logger = require('../config/logger');

/**
 * Retrieve top matching knowledge chunks from Supabase pgvector RPC
 */
async function retrieveSimilarChunks({ queryEmbedding, topK, minSimilarity, category = null }) {
  const matchCount = topK || env.CHATBOT_TOP_K || 5;
  const similarityThreshold = minSimilarity ?? env.CHATBOT_MIN_SIMILARITY ?? 0.5;

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.rpc('match_chatbot_chunks', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      similarity_threshold: similarityThreshold,
      filter_category: category || null
    });

    if (error) {
      logger.error({ err: error }, 'Supabase pgvector match_chatbot_chunks RPC error');
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error({ err: error }, 'Failed to execute vector retrieval search');
    return [];
  }
}

module.exports = {
  retrieveSimilarChunks
};
