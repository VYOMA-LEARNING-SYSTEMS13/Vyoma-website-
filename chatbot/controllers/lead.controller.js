const { createLead } = require('../services/lead.service');
const { sendSuccess } = require('../utils/response');

/**
 * POST /api/chatbot/leads
 */
async function handleCreateLead(req, res) {
  const { name, email, phone, company, requirement, sessionId } = req.body;

  const lead = await createLead({
    name,
    email,
    phone,
    company,
    requirement,
    sessionId
  });

  return sendSuccess(res, { lead }, 201);
}

module.exports = {
  handleCreateLead
};
