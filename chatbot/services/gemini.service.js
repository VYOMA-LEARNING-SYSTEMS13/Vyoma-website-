const { GoogleGenAI } = require('@google/genai');
const { env } = require('../config/env');
const logger = require('../config/logger');

let genAIClient = null;

function getGenAI() {
  if (!genAIClient) {
    if (!env.GEMINI_API_KEY) {
      logger.warn('⚠️ GEMINI_API_KEY is not set. Gemini API calls will fail.');
    }
    genAIClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY || 'placeholder_key' });
  }
  return genAIClient;
}

/**
 * Parse retry delay from Gemini error message (e.g., "Please retry in 20.417s")
 */
function parseRetryDelay(errorMessage) {
  const match = String(errorMessage).match(/Please retry in ([\d\.]+)s/i);
  if (match && match[1]) {
    const seconds = parseFloat(match[1]);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.min(Math.ceil(seconds * 1000) + 500, 35000);
    }
  }
  return null;
}

/**
 * Generate a standard non-streaming answer using Gemini (@google/genai)
 */
async function generateAnswer({ prompt, systemInstruction, history = [], temperature = 0.2 }) {
  const ai = getGenAI();
  const configuredName = env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  const candidateModels = Array.from(
    new Set([
      configuredName,
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite'
    ])
  ).filter(Boolean);

  let contents = [];
  if (history && history.length > 0) {
    contents = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  for (const mName of candidateModels) {
    let attempt = 0;
    const backoffDelays = [5000, 15000, 30000];

    while (attempt <= 3) {
      try {
        const response = await ai.models.generateContent({
          model: mName,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature,
            maxOutputTokens: 1024
          }
        });
        return response.text;
      } catch (error) {
        const msg = String(error.message || error);
        const is429 = error?.status === 429 || msg.includes('429') || msg.includes('Quota exceeded');

        if (is429) {
          if (msg.includes('limit: 0') || msg.includes('limit: 0.0')) {
            logger.error({ model: mName }, 'Gemini model has zero quota for this project (limit: 0). Skipping immediately.');
            break;
          }

          attempt++;
          if (attempt <= 3) {
            const parsedDelay = parseRetryDelay(msg);
            const delay = parsedDelay || backoffDelays[attempt - 1] || 15000;
            logger.warn({ model: mName, attempt, delayMs: delay }, `Gemini temporary rate limit hit. Respecting retry delay of ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }

        logger.warn({ failedModel: mName, err: msg }, 'Gemini candidate model error, trying next fallback model...');
        break;
      }
    }
  }

  throw new Error('All Gemini generation candidate models returned errors');
}

/**
 * Generate a streaming answer using Gemini (@google/genai) with callback per chunk
 */
async function generateStreamingAnswer({ prompt, systemInstruction, history = [], onChunk, temperature = 0.2 }) {
  const ai = getGenAI();
  const configuredName = env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  const candidateModels = Array.from(
    new Set([
      configuredName,
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite'
    ])
  ).filter(Boolean);

  let contents = [];
  if (history && history.length > 0) {
    contents = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  for (const mName of candidateModels) {
    let attempt = 0;
    const backoffDelays = [5000, 15000, 30000];

    while (attempt <= 3) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: mName,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature,
            maxOutputTokens: 1024
          }
        });

        let fullText = '';
        for await (const chunk of responseStream) {
          if (chunk.text) {
            fullText += chunk.text;
            if (onChunk) {
              onChunk(chunk.text);
            }
          }
        }
        return fullText;
      } catch (error) {
        const msg = String(error.message || error);
        const is429 = error?.status === 429 || msg.includes('429') || msg.includes('Quota exceeded');

        if (is429) {
          if (msg.includes('limit: 0') || msg.includes('limit: 0.0')) {
            logger.error({ model: mName }, 'Gemini model has zero quota for this project (limit: 0). Skipping immediately.');
            break;
          }

          attempt++;
          if (attempt <= 3) {
            const parsedDelay = parseRetryDelay(msg);
            const delay = parsedDelay || backoffDelays[attempt - 1] || 15000;
            logger.warn({ model: mName, attempt, delayMs: delay }, `Gemini temporary rate limit hit. Respecting retry delay of ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }

        logger.warn({ failedModel: mName, err: msg }, 'Gemini candidate model stream error, trying next fallback model...');
        break;
      }
    }
  }

  logger.error('All Gemini generation candidate models failed stream generation');
  throw new Error('All Gemini generation candidate models returned errors');
}

/**
 * Rewrite user message + conversation history into a standalone vector search query
 */
async function rewriteSearchQuery({ userMessage, history = [] }) {
  const COMPANY_NAME = 'Vyoma Learning Systems';
  const lowerMsg = userMessage.toLowerCase().trim();

  // Enrich vague queries that don't mention the company name
  // so the vector embedding can match company knowledge documents
  const mentionsCompany = /vyoma|curio|nova|vibe/i.test(lowerMsg);
  if (!mentionsCompany && lowerMsg.split(/\s+/).length <= 8) {
    const enriched = `${userMessage} ${COMPANY_NAME}`;
    if (!history || history.length === 0) {
      return enriched;
    }
  }

  if (!history || history.length === 0) {
    return userMessage;
  }

  const ambiguousPronouns = /\b(it|its|they|them|their|that|this|these|those|he|him|his|she|her)\b/i;

  if (!ambiguousPronouns.test(lowerMsg) || lowerMsg.split(/\s+/).length > 6) {
    // If query doesn't mention company, return enriched version for vector search
    if (!mentionsCompany && lowerMsg.split(/\s+/).length <= 8) {
      return `${userMessage} ${COMPANY_NAME}`;
    }
    return userMessage;
  }

  try {
    const ai = getGenAI();
    const candidateModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'];

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
        const result = await ai.models.generateContent({
          model: mName,
          contents: prompt,
          config: { temperature: 0.0, maxOutputTokens: 150 }
        });
        const rewritten = (result.text || '').trim();
        return rewritten || userMessage;
      } catch (err) {
        const msg = String(err.message || err);
        if (msg.includes('404') || msg.includes('429')) continue;
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
