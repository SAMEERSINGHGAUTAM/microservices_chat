const SOCKET_EVENTS = require('./events');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const Participant = require('../models/participant.model');

// Store connected users
const connectedUsers = new Map();

const initializeSocket = (io) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle user joining
    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async (conversationId, userId) => {
      try {
        socket.join(conversationId);
        
        // Mark user as online
        connectedUsers.set(userId, socket.id);
        
        // Update participant status
        await Participant.updateOne(
          { userId },
          { isOnline: true, lastSeen: Date.now() }
        );
        
        // Emit user online event
        socket.to(conversationId).emit(SOCKET_EVENTS.USER_ONLINE, userId);
      } catch (error) {
        console.error('Join conversation error:', error);
        socket.emit(SOCKET_EVENTS.ERROR, 'Failed to join conversation');
      }
    });
    
    // Handle user leaving
    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, async (conversationId, userId) => {
      try {
        socket.leave(conversationId);
        
        // Mark user as offline
        connectedUsers.delete(userId);
        
        // Update participant status
        await Participant.updateOne(
          { userId },
          { isOnline: false, lastSeen: Date.now() }
        );
        
        // Emit user offline event
        socket.to(conversationId).emit(SOCKET_EVENTS.USER_OFFLINE, userId);
      } catch (error) {
        console.error('Leave conversation error:', error);
        socket.emit(SOCKET_EVENTS.ERROR, 'Failed to leave conversation');
      }
    });
    
    // Handle sending message
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (messageData) => {
      try {
        const { conversationId, senderId, content, type, mediaUrl } = messageData;
        
        // Create and save message
        const message = new Message({
          conversationId,
          senderId,
          content,
          type,
          mediaUrl
        });
        
        await message.save();
        
        // Emit message to all users in conversation
        io.to(conversationId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit(SOCKET_EVENTS.ERROR, 'Failed to send message');
      }
    });
    
    // Handle typing start
    socket.on(SOCKET_EVENTS.TYPING_START, (conversationId, userId) => {
      socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_START, userId);
    });
    
    // Handle typing stop
    socket.on(SOCKET_EVENTS.TYPING_STOP, (conversationId, userId) => {
      socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_STOP, userId);
    });
    
    // Handle disconnect
    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      console.log('User disconnected:', socket.id);
      
      // Find user by socket ID and mark as offline
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          
          // Update participant status
          await Participant.updateOne(
            { userId },
            { isOnline: false, lastSeen: Date.now() }
          );
          
          // Emit user offline event to all conversations
          const conversations = await Conversation.find({ participants: userId });
          conversations.forEach(conversation => {
            socket.to(conversation._id).emit(SOCKET_EVENTS.USER_OFFLINE, userId);
          });
          
          break;
        }
      }
    });
  });
};

module.exports = { initializeSocket };
