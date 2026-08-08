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

async function getWorkingGenerativeModel(ai, systemInstruction, temperature) {
  const configuredName = (env.GEMINI_MODEL || 'gemini-2.0-flash').replace(/^models\//, '');
  const candidateModels = [configuredName, 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-2.5-flash', 'gemini-flash-latest'];

  for (const mName of candidateModels) {
    try {
      const model = ai.getGenerativeModel({
        model: mName,
        systemInstruction: systemInstruction || undefined,
        generationConfig: {
          temperature,
          maxOutputTokens: 1024
        }
      });
      return { model, modelName: mName };
    } catch (err) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  return {
    model: ai.getGenerativeModel({
      model: configuredName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: { temperature, maxOutputTokens: 1024 }
    }),
    modelName: configuredName
  };
}

/**
 * Generate a standard non-streaming answer using Gemini
 */
async function generateAnswer({ prompt, systemInstruction, history = [], temperature = 0.2 }) {
  const ai = getGenAI();
  const candidateModels = [
    'gemini-1.5-flash-latest',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash'
  ];

  let contents = [];
  if (history && history.length > 0) {
    contents = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  for (const mName of candidateModels) {
    try {
      const model = ai.getGenerativeModel({
        model: mName,
        systemInstruction: systemInstruction || undefined,
        generationConfig: { temperature, maxOutputTokens: 1024 }
      });
      const response = await model.generateContent({ contents });
      return response.response.text();
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        logger.warn({ failedModel: mName }, 'Gemini model 404, trying next generation model...');
        continue;
      }
      if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
        logger.warn({ failedModel: mName }, 'Gemini 429 rate limit on model, trying next candidate model...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      logger.error({ err: error.message }, 'Gemini generateAnswer error');
      throw error;
    }
  }
  throw new Error('All Gemini generation candidate models returned errors');
}

/**
 * Generate a streaming answer using Gemini with callback per chunk
 */
async function generateStreamingAnswer({ prompt, systemInstruction, history = [], onChunk, temperature = 0.2 }) {
  const ai = getGenAI();
  const candidateModels = [
    'gemini-1.5-flash-latest',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash'
  ];

  let contents = [];
  if (history && history.length > 0) {
    contents = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  for (const mName of candidateModels) {
    try {
      const model = ai.getGenerativeModel({
        model: mName,
        systemInstruction: systemInstruction || undefined,
        generationConfig: { temperature, maxOutputTokens: 1024 }
      });
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
      if (error.message.includes('404') || error.message.includes('429') || error.message.includes('Quota exceeded')) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      throw error;
    }
  }
  throw new Error('All Gemini generation candidate models returned errors');
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
    const candidateModels = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

    const formattedHistory = history
      .slice(-4)
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    const prompt = `Given the following conversation history and follow-up question, rephrase the follow-up question into a single standalone search query suitable for a company database lookup. Do NOT answer the question, only output the standalone search query. If the question is already self-contained, return it as-is.

Conversation History:
${formattedHistory}

Follow-up Question: ${userMessage}

Standalone Search Query:`;

    for (const mName of candidateModels) {
      try {
        const model = ai.getGenerativeModel({
          model: mName,
          generationConfig: { temperature: 0.0, maxOutputTokens: 200 }
        });
        const result = await model.generateContent(prompt);
        const rewritten = result.response.text().trim();
        return rewritten || userMessage;
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('429')) continue;
        throw err;
      }
    }
    return userMessage;
  } catch (error) {
    logger.warn({ err: error.message }, 'Failed to rewrite search query, defaulting to raw message');
    return userMessage;
  }
}

module.exports = {
  generateAnswer,
  generateStreamingAnswer,
  rewriteSearchQuery
};
