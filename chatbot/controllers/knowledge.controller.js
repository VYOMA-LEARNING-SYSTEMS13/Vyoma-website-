const { getSupabaseClient } = require('../config/supabase');
const { seedKnowledgeDirectory } = require('../scripts/seed-knowledge');
const { sendSuccess } = require('../utils/response');

/**
 * GET /api/chatbot/health
 */
async function handleHealthCheck(req, res) {
  let dbStatus = 'disconnected';
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('chatbot_documents').select('id').limit(1);
    if (!error) dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'unavailable';
  }

  return sendSuccess(res, {
    status: 'ok',
    service: 'chatbot',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
}

/**
 * GET /api/chatbot/knowledge
 */
async function handleGetKnowledge(req, res) {
  const supabase = getSupabaseClient();
  let docs = [];

  try {
    const { data } = await supabase
      .from('chatbot_documents')
      .select('id, title, source_type, source_url, category, is_active, created_at')
      .eq('is_active', true);
    docs = data || [];
  } catch (err) {
    docs = [];
  }

  return sendSuccess(res, { documents: docs });
}

/**
 * POST /api/chatbot/knowledge/reindex
 * Protected / administrative re-indexing trigger
 */
async function handleReindexKnowledge(req, res) {
  const adminSecret = req.headers['x-admin-key'];
  const configuredSecret = process.env.ADMIN_SECRET;

  if (!configuredSecret || adminSecret !== configuredSecret) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CHATBOT_FORBIDDEN',
        message: 'Unauthorized: Valid X-Admin-Key header required'
      }
    });
  }

  seedKnowledgeDirectory()
    .then(() => {})
    .catch(() => {});

  return sendSuccess(res, { message: 'Re-indexing initiated in background' });
}

module.exports = {
  handleHealthCheck,
  handleGetKnowledge,
  handleReindexKnowledge
};
