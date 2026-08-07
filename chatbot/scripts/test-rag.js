const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { processChatMessage } = require('../services/rag.service');
const { validateEnv } = require('../config/env');
const logger = require('../config/logger');

async function runRAGTests() {
  validateEnv();

  console.log('\n======================================================');
  console.log('🤖 RUNNING CHATBOT RAG TEST SUITE');
  console.log('======================================================\n');

  const testCases = [
    { name: 'Company Overview', question: 'What does the company do?' },
    { name: 'Products Offerings', question: 'What products do you offer?' },
    { name: 'Pricing Query', question: 'What is the price of Curio AI & Immersive Lab?' },
    { name: 'Refund Policy', question: 'What is your refund policy?' },
    { name: 'Contact Info', question: 'What is your contact email?' },
    { name: 'Privacy Policy', question: 'What is your privacy policy?' },
    { name: 'Unknown/Out of Domain Query (Fallback Test)', question: 'Tell me about quantum gravity in black holes.' },
    { name: 'Follow-up Context Test', question: 'How much does it cost?', isFollowUp: true }
  ];

  let testSessionId = null;

  for (const testCase of testCases) {
    console.log(`\n------------------------------------------------------`);
    console.log(`[TEST] ${testCase.name}`);
    console.log(`User Question: "${testCase.question}"`);

    try {
      const result = await processChatMessage({
        message: testCase.question,
        sessionId: testSessionId,
        visitorId: 'test_runner_user'
      });

      testSessionId = result.sessionId;

      console.log(`Session ID: ${result.sessionId}`);
      console.log(`Message ID: ${result.messageId}`);
      console.log(`Sources (${result.sources.length}):`, result.sources.map((s) => s.title).join(', ') || 'None');
      console.log(`AI Answer:\n${result.answer}`);
    } catch (err) {
      console.error(`❌ Test failed with error:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log('✅ RAG TEST SUITE EXECUTION COMPLETE');
  console.log('======================================================\n');
}

if (require.main === module) {
  runRAGTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}

module.exports = {
  runRAGTests
};
