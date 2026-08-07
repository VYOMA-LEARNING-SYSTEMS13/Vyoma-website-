const express = require('express');
const router = express.Router();

const chatRoutes = require('./chat.routes');
const leadRoutes = require('./lead.routes');
const feedbackRoutes = require('./feedback.routes');
const knowledgeRoutes = require('./knowledge.routes');

router.use('/chat', chatRoutes);
router.use('/leads', leadRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/', knowledgeRoutes);

module.exports = router;
