const { GoogleGenerativeAI } = require('@google/generative-ai');
const { env } = require('../config/env');
const logger = require('../config/logger');

let genAIClient = null;

function getGenAI() {
  if (!genAIClient) {
    if (!env.GEMINI_API_KEY) {
      logger.warn('⚠️ GEMINI_API_KEY is not set. Gemini API calls will fail.');
    }
    genAIClient = new GoogleGenerativeAI(env.GEMINI_API_KEY || 'placeholder_key');
  }
  return genAIClient;
}

/**
 * Generate a standard non-streaming answer using Gemini
 */
async function generateAnswer({ prompt, systemInstruction, history = [], temperature = 0.2 }) {
  try {
    const ai = getGenAI();
    const modelName = env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    const model = ai.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        temperature,
        maxOutputTokens: 1024
      }
    });

    let contents = [];
    if (history && history.length > 0) {
      contents = history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await model.generateContent({ contents });
    return response.response.text();
  } catch (error) {
    logger.error({ err: error }, 'Gemini generateAnswer error');
    throw error;
  }
}

/**
 * Generate a streaming answer using Gemini with callback per chunk
 */
async function generateStreamingAnswer({ prompt, systemInstruction, history = [], onChunk, temperature = 0.2 }) {
  try {
    const ai = getGenAI();
    const modelName = env.GEMINI_MODEL || 'gemini-1.5-flash';

    const model = ai.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        temperature,
        maxOutputTokens: 1024
      }
    });

    let contents = [];
    if (history && history.length > 0) {
      contents = history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const resultStream = await model.generateContentStream({ contents });

    let fullText = '';
    for await (const chunk of resultStream.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) {
        onChunk(chunkText);
      }
    }

    return fullText;
  } catch (error) {
    logger.error({ err: error }, 'Gemini generateStreamingAnswer error');
    throw error;
  }
}

/**
 * Rewrite user message + conversation history into a standalone vector search query
 */
async function rewriteSearchQuery({ userMessage, history = [] }) {
  if (!history || history.length === 0) {
    return userMessage;
  }

  try {
    const ai = getGenAI();
    const modelName = env.GEMINI_MODEL || 'gemini-1.5-flash';

    const model = ai.getGenerativeModel({
      model: modelName,
      generationConfig: { temperature: 0.0, maxOutputTokens: 200 }
    });

    const formattedHistory = history
      .slice(-4)
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    const prompt = `Given the following conversation history and follow-up question, rephrase the follow-up question into a single standalone search query suitable for a company database lookup. Do NOT answer the question, only output the standalone search query. If the question is already self-contained, return it as-is.

Conversation History:
${formattedHistory}

Follow-up Question: ${userMessage}

Standalone Search Query:`;

    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();
    return rewritten || userMessage;
  } catch (error) {
    logger.warn({ err: error }, 'Failed to rewrite search query, defaulting to raw message');
    return userMessage;
  }
}

module.exports = {
  generateAnswer,
  generateStreamingAnswer,
  rewriteSearchQuery
};
