const Message = require('../models/message.model');
const { sendMessageService, getMessagesService, deleteMessageService } = require('../services/message.service');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content, type, mediaUrl } = req.body;
    
    // Send message
    const message = await sendMessageService(conversationId, senderId, content, type, mediaUrl);
    
    res.status(201).json({
      message: 'Message sent successfully',
      message
    });
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({ error: 'Message sending failed' });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit, offset } = req.query;
    
    // Get messages
    const messages = await getMessagesService(conversationId, limit, offset);
    
    res.status(200).json({
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete message
    const result = await deleteMessageService(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(200).json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage
};
