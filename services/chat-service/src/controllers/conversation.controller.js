const Conversation = require('../models/conversation.model');
const Participant = require('../models/participant.model');
const { createConversationService, getConversationsService, getConversationByIdService, updateConversationService, deleteConversationService } = require('../services/conversation.service');

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { name, participants, isGroup } = req.body;
    
    // Create conversation
    const conversation = await createConversationService(name, participants, isGroup);
    
    res.status(201).json({
      message: 'Conversation created successfully',
      conversation
    });
  } catch (error) {
    console.error('Conversation creation error:', error);
    res.status(500).json({ error: 'Conversation creation failed' });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get conversations
    const conversations = await getConversationsService(userId);
    
    res.status(200).json({
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

// Get conversation by ID
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get conversation
    const conversation = await getConversationByIdService(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.status(200).json({
      conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

// Update conversation
const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, participants } = req.body;
    
    // Update conversation
    const conversation = await updateConversationService(id, name, participants);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.status(200).json({
      message: 'Conversation updated successfully',
      conversation
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete conversation
    const result = await deleteConversationService(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.status(200).json({
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation
};
