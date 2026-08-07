const { getSupabaseClient } = require('../config/supabase');
const { v4: uuidv4 } = require('crypto');
const logger = require('../config/logger');

// In-memory fallback map for offline/local testing when DB connection is not configured
const inMemorySessions = new Map();
const inMemoryMessages = new Map();

function generateUuid() {
  return (require('crypto').randomUUID) ? require('crypto').randomUUID() : 'session_' + Date.now();
}

/**
 * Get existing chatbot session or create a new session
 */
async function getOrCreateSession(sessionId, visitorId = null, metadata = {}) {
  const supabase = getSupabaseClient();

  if (sessionId) {
    try {
      const { data, error } = await supabase
        .from('chatbot_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (data && !error) return data;
    } catch (err) {
      logger.warn({ err: err.message }, 'Failed to load session from Supabase, checking memory fallback');
    }

    if (inMemorySessions.has(sessionId)) {
      return inMemorySessions.get(sessionId);
    }
  }

  const newSessionId = sessionId || generateUuid();
  const sessionRecord = {
    id: newSessionId,
    visitor_id: visitorId,
    metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('chatbot_sessions')
      .insert([sessionRecord])
      .select()
      .single();

    if (data && !error) return data;
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not persist session to Supabase, using memory fallback');
  }

  inMemorySessions.set(newSessionId, sessionRecord);
  return sessionRecord;
}

/**
 * Save user/assistant/system message to conversation session
 */
async function saveMessage({ sessionId, role, content, sources = [], metadata = {} }) {
  const supabase = getSupabaseClient();
  const messageRecord = {
    id: generateUuid(),
    session_id: sessionId,
    role,
    content,
    sources: sources || [],
    metadata: metadata || {},
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('chatbot_messages')
      .insert([messageRecord])
      .select()
      .single();

    if (data && !error) return data;
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not save message to Supabase, saving to memory fallback');
  }

  if (!inMemoryMessages.has(sessionId)) {
    inMemoryMessages.set(sessionId, []);
  }
  inMemoryMessages.get(sessionId).push(messageRecord);
  return messageRecord;
}

/**
 * Retrieve recent messages from conversation history
 */
async function getRecentMessages(sessionId, limit = 10) {
  if (!sessionId) return [];

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (data && !error) {
      return data.reverse();
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Failed to fetch conversation history from Supabase');
  }

  const memMsgs = inMemoryMessages.get(sessionId) || [];
  return memMsgs.slice(-limit);
}

module.exports = {
  getOrCreateSession,
  saveMessage,
  getRecentMessages
};
