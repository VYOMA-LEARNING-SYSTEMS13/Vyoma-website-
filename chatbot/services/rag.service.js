const { getOrCreateSession, saveMessage, getRecentMessages } = require('./conversation.service');
const { searchKnowledgeBase } = require('../rag/retriever');
const { generateAnswer, generateStreamingAnswer, rewriteSearchQuery } = require('./gemini.service');
const { SYSTEM_PROMPT, buildRAGPrompt } = require('../rag/prompt');
const { evaluateConfidence } = require('../rag/confidence');
const { extractCitations } = require('../rag/citations');
const { env } = require('../config/env');
const logger = require('../config/logger');

/**
 * Process RAG Chat Message (Non-Streaming)
 */
async function processChatMessage({ message, sessionId, visitorId }) {
  const startTime = Date.now();

  // 1. Get or create session
  const session = await getOrCreateSession(sessionId, visitorId);
  const activeSessionId = session.id;

  // 2. Save user message
  await saveMessage({
    sessionId: activeSessionId,
    role: 'user',
    content: message
  });

  // 3. Load recent conversation history for follow-up context
  const maxHistory = env.CHATBOT_MAX_HISTORY || 10;
  const recentMessages = await getRecentMessages(activeSessionId, maxHistory);
  // Exclude current user message from history array passed to query rewriter
  const historyForRewriter = recentMessages.slice(0, -1);

  // 4. Rewrite query if this is a follow-up question
  const standaloneQuery = await rewriteSearchQuery({
    userMessage: message,
    history: historyForRewriter
  });

  logger.info({ rawMessage: message, standaloneQuery }, 'Executing vector search');

  // 5. Vector search retrieval
  const retrievedChunks = await searchKnowledgeBase(standaloneQuery);

  // 6. Evaluate confidence
  const confidence = evaluateConfidence(retrievedChunks);
  const sources = extractCitations(retrievedChunks);

  let finalAnswer = '';

  if (!confidence.isConfident && (!retrievedChunks || retrievedChunks.length === 0)) {
    logger.info('Low confidence vector match, returning fallback response');
    finalAnswer = confidence.fallbackMessage;
  } else {
    // 7. Construct RAG prompt & query Gemini
    const ragPrompt = buildRAGPrompt({
      contextChunks: retrievedChunks,
      userMessage: message
    });

    try {
      finalAnswer = await generateAnswer({
        prompt: ragPrompt,
        systemInstruction: SYSTEM_PROMPT,
        history: historyForRewriter,
        temperature: 0.2
      });
    } catch (err) {
      logger.error({ err: err.message }, 'Gemini execution error in RAG service, providing fallback');
      finalAnswer = confidence.fallbackMessage;
    }
  }

  // 8. Save assistant message
  const assistantMsg = await saveMessage({
    sessionId: activeSessionId,
    role: 'assistant',
    content: finalAnswer,
    sources
  });

  logger.info({ latencyMs: Date.now() - startTime, sessionId: activeSessionId }, 'RAG Chat message processed');

  return {
    answer: finalAnswer,
    sessionId: activeSessionId,
    messageId: assistantMsg.id,
    sources
  };
}

/**
 * Process RAG Chat Message (SSE Token Streaming)
 */
async function processStreamingChatMessage({ message, sessionId, visitorId, onToken, onSources }) {
  const session = await getOrCreateSession(sessionId, visitorId);
  const activeSessionId = session.id;

  await saveMessage({
    sessionId: activeSessionId,
    role: 'user',
    content: message
  });

  const maxHistory = env.CHATBOT_MAX_HISTORY || 10;
  const recentMessages = await getRecentMessages(activeSessionId, maxHistory);
  const historyForRewriter = recentMessages.slice(0, -1);

  const standaloneQuery = await rewriteSearchQuery({
    userMessage: message,
    history: historyForRewriter
  });

  const retrievedChunks = await searchKnowledgeBase(standaloneQuery);
  const confidence = evaluateConfidence(retrievedChunks);
  const sources = extractCitations(retrievedChunks);

  if (onSources) {
    onSources(sources);
  }

  let fullAnswer = '';

  if (!confidence.isConfident && (!retrievedChunks || retrievedChunks.length === 0)) {
    fullAnswer = confidence.fallbackMessage;
    if (onToken) onToken(fullAnswer);
  } else {
    const ragPrompt = buildRAGPrompt({
      contextChunks: retrievedChunks,
      userMessage: message
    });

    try {
      fullAnswer = await generateStreamingAnswer({
        prompt: ragPrompt,
        systemInstruction: SYSTEM_PROMPT,
        history: historyForRewriter,
        onChunk: (chunkText) => {
          if (onToken) onToken(chunkText);
        },
        temperature: 0.2
      });
    } catch (err) {
      logger.error({ err: err.message }, 'Gemini streaming error in RAG service');
      fullAnswer = confidence.fallbackMessage;
      if (onToken) onToken(fullAnswer);
    }
  }

  const assistantMsg = await saveMessage({
    sessionId: activeSessionId,
    role: 'assistant',
    content: fullAnswer,
    sources
  });

  return {
    answer: fullAnswer,
    sessionId: activeSessionId,
    messageId: assistantMsg.id,
    sources
  };
}

module.exports = {
  processChatMessage,
  processStreamingChatMessage
};
