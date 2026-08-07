const { getSupabaseClient } = require('../config/supabase');
const { sendSuccess } = require('../utils/response');
const logger = require('../config/logger');

/**
 * POST /api/chatbot/feedback
 */
async function handleCreateFeedback(req, res) {
  const { sessionId, messageId, rating, comment } = req.body;

  const supabase = getSupabaseClient();
  const feedbackRecord = {
    session_id: sessionId,
    message_id: messageId || null,
    rating,
    comment: comment || null,
    created_at: new Date().toISOString()
  };

  try {
    const { data } = await supabase
      .from('chatbot_feedback')
      .insert([feedbackRecord])
      .select()
      .single();

    logger.info({ feedbackId: data?.id, rating }, 'Chatbot feedback recorded');
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not persist feedback to DB');
  }

  return sendSuccess(res, { recorded: true }, 201);
}

module.exports = {
  handleCreateFeedback
};
