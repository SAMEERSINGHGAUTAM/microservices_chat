const Conversation = require('../models/conversation.model');
const Participant = require('../models/participant.model');

// Create a new conversation
const createConversationService = async (name, participants, isGroup) => {
  try {
    // Create conversation
    const conversation = new Conversation({
      name,
      participants,
      isGroup
    });
    
    await conversation.save();
    return conversation;
  } catch (error) {
    throw new Error('Conversation creation failed: ' + error.message);
  }
};

// Get all conversations for a user
const getConversationsService = async (userId) => {
  try {
    // Find conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    }).populate('participants');
    
    return conversations;
  } catch (error) {
    throw new Error('Failed to get conversations: ' + error.message);
  }
};

// Get conversation by ID
const getConversationByIdService = async (id) => {
  try {
    // Find conversation by ID
    const conversation = await Conversation.findById(id).populate('participants');
    return conversation;
  } catch (error) {
    throw new Error('Failed to get conversation: ' + error.message);
  }
};

// Update conversation
const updateConversationService = async (id, name, participants) => {
  try {
    // Update conversation
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { name, participants },
      { new: true }
    ).populate('participants');
    
    return conversation;
  } catch (error) {
    throw new Error('Failed to update conversation: ' + error.message);
  }
};

// Delete conversation
const deleteConversationService = async (id) => {
  try {
    // Delete conversation
    const conversation = await Conversation.findByIdAndDelete(id);
    return conversation;
  } catch (error) {
    throw new Error('Failed to delete conversation: ' + error.message);
  }
};

module.exports = {
  createConversationService,
  getConversationsService,
  getConversationByIdService,
  updateConversationService,
  deleteConversationService
};
