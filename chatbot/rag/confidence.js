const { env } = require('../config/env');

const DEFAULT_FALLBACK_MESSAGE = "I couldn't find that information in our company knowledge base. Please contact our team for more details.";

/**
 * Evaluate retrieval confidence score based on similarity thresholds
 */
function evaluateConfidence(retrievedChunks, minSimilarityThreshold = null) {
  const threshold = minSimilarityThreshold ?? env.CHATBOT_MIN_SIMILARITY ?? 0.5;

  if (!retrievedChunks || retrievedChunks.length === 0) {
    return {
      isConfident: false,
      topScore: 0,
      fallbackMessage: DEFAULT_FALLBACK_MESSAGE
    };
  }

  const topScore = Math.max(...retrievedChunks.map((c) => c.similarity || 0));

  if (topScore < threshold) {
    return {
      isConfident: false,
      topScore,
      fallbackMessage: DEFAULT_FALLBACK_MESSAGE
    };
  }

  return {
    isConfident: true,
    topScore,
    fallbackMessage: null
  };
}

module.exports = {
  evaluateConfidence,
  DEFAULT_FALLBACK_MESSAGE
};
