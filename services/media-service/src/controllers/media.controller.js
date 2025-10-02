const Media = require('../models/media.model');
const { uploadMediaService, getMediaService, deleteMediaService } = require('../services/upload.service');

// Upload media
const uploadMedia = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { userId, conversationId } = req.body;
    
    // Upload media
    const media = await uploadMediaService(req.file, userId, conversationId);
    
    res.status(201).json({
      message: 'Media uploaded successfully',
      media
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

// Get media by conversation ID
const getMedia = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit, offset } = req.query;
    
    // Get media
    const media = await getMediaService(conversationId, limit, offset);
    
    res.status(200).json({
      media
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Failed to get media' });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete media
    await deleteMediaService(id);
    
    res.status(200).json({
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia
};
