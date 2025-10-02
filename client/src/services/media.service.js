import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/media';

// Upload media
export const uploadMedia = async (file, conversationId) => {
  try {
    const token = localStorage.getItem('token');
    
    // Create FormData
    const formData = new FormData();
    formData.append('media', file);
    formData.append('conversationId', conversationId);
    
    // Upload media
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload media');
  }
};

// Get media by conversation ID
export const getMedia = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.media;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get media');
  }
};

// Delete media
export const deleteMedia = async (mediaId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete media');
  }
};
