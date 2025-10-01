const express = require('express');
const router = express.Router();

const { createConversation, getConversations, getConversationById, updateConversation, deleteConversation } = require('../controllers/conversation.controller');
const { sendMessage, getMessages, deleteMessage } = require('../controllers/message.controller');

// Conversation routes
router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.put('/conversations/:id', updateConversation);
router.delete('/conversations/:id', deleteConversation);

// Message routes
router.post('/messages', sendMessage);
router.get('/messages/:conversationId', getMessages);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
