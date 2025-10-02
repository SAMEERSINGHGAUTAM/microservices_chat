import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/chat';

// Get conversations
export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.conversations;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get conversations');
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.messages;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get messages');
  }
};

// Send a message
export const sendMessage = async (conversationId, content) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/messages`, 
      { conversationId, content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

// Create a conversation
export const createConversation = async (participants, name = null) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/conversations`, 
      { participants, name },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.conversation;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create conversation');
  }
};
