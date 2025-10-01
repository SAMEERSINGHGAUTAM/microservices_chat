const Message = require('../models/message.model');
const { encryptMessage, decryptMessage } = require('./encryption.service');

// Send a new message
const sendMessageService = async (conversationId, senderId, content, type, mediaUrl) => {
  try {
    let encryptedContent = content;
    let encryptionKey = null;
    let isEncrypted = false;
    
    // Encrypt message if it's a text message
    if (type === 'text') {
      const encryptionResult = encryptMessage(content);
      encryptedContent = encryptionResult.encryptedData;
      encryptionKey = encryptionResult.key;
      isEncrypted = true;
    }
    
    // Create message
    const message = new Message({
      conversationId,
      senderId,
      content: encryptedContent,
      type,
      mediaUrl,
      isEncrypted,
      encryptionKey
    });
    
    await message.save();
    return message;
  } catch (error) {
    throw new Error('Message sending failed: ' + error.message);
  }
};

// Get messages for a conversation
const getMessagesService = async (conversationId, limit = 50, offset = 0) => {
  try {
    // Find messages for conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    
    // Decrypt messages if they are encrypted
    const decryptedMessages = messages.map(message => {
      if (message.isEncrypted && message.encryptionKey) {
        message.content = decryptMessage(message.content, message.encryptionKey);
      }
      return message;
    });
    
    return decryptedMessages;
  } catch (error) {
    throw new Error('Failed to get messages: ' + error.message);
  }
};

// Delete a message
const deleteMessageService = async (id) => {
  try {
    // Delete message
    const message = await Message.findByIdAndDelete(id);
    return message;
  } catch (error) {
    throw new Error('Failed to delete message: ' + error.message);
  }
};

module.exports = {
  sendMessageService,
  getMessagesService,
  deleteMessageService
};
