const { getSupabaseClient } = require('../config/supabase');
const logger = require('../config/logger');

const inMemoryLeads = [];

/**
 * Save captured lead details into Supabase chatbot_leads table
 */
async function createLead({ name, email, phone, company, requirement, sessionId }) {
  const supabase = getSupabaseClient();
  const leadRecord = {
    session_id: sessionId || null,
    name,
    email,
    phone: phone || null,
    company: company || null,
    requirement: requirement || null,
    status: 'new',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('chatbot_leads')
      .insert([leadRecord])
      .select()
      .single();

    if (data && !error) {
      logger.info({ leadId: data.id, email }, 'Lead captured successfully');
      return data;
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Failed to insert lead into Supabase, storing in memory fallback');
  }

  leadRecord.id = 'lead_' + Date.now();
  inMemoryLeads.push(leadRecord);
  return leadRecord;
}

module.exports = {
  createLead
};
