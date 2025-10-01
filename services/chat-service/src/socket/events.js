// Socket.io event types
const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Message events
  SEND_MESSAGE: 'message:send',
  RECEIVE_MESSAGE: 'message:receive',
  DELETE_MESSAGE: 'message:delete',
  
  // Conversation events
  CREATE_CONVERSATION: 'conversation:create',
  UPDATE_CONVERSATION: 'conversation:update',
  DELETE_CONVERSATION: 'conversation:delete',
  JOIN_CONVERSATION: 'conversation:join',
  LEAVE_CONVERSATION: 'conversation:leave',
  
  // Typing events
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  
  // Error events
  ERROR: 'error'
};

module.exports = SOCKET_EVENTS;
