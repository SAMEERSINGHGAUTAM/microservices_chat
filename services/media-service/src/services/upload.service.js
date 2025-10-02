const multer = require('multer');
const sharp = require('sharp');
const Media = require('../models/media.model');
const { uploadToS3, deleteFromS3 } = require('./s3.service');
const { compressImage, compressVideo } = require('./compression.service');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') || 
        file.mimetype.startsWith('audio/') ||
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload media service
const uploadMediaService = async (file, userId, conversationId) => {
  try {
    // Determine file type
    let type = 'document';
    if (file.mimetype.startsWith('image/')) {
      type = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      type = 'video';
    } else if (file.mimetype.startsWith('audio/')) {
      type = 'audio';
    }
    
    // Compress media if needed
    let compressedBuffer = file.buffer;
    if (type === 'image') {
      compressedBuffer = await compressImage(file.buffer);
    } else if (type === 'video') {
      // In a real application, you would compress videos here
      // compressedBuffer = await compressVideo(file.buffer);
    }
    
    // Upload to S3
    const s3Result = await uploadToS3(compressedBuffer, file.originalname, file.mimetype);
    
    // Create thumbnail for images
    let thumbnailUrl = null;
    if (type === 'image') {
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(200, 200)
        .jpeg({ quality: 80 })
        .toBuffer();
      
      const thumbnailResult = await uploadToS3(
        thumbnailBuffer, 
        'thumb_' + file.originalname, 
        'image/jpeg'
      );
      
      thumbnailUrl = thumbnailResult.url;
    }
    
    // Save media record to database
    const media = new Media({
      userId,
      conversationId,
      type,
      originalName: file.originalname,
      fileName: s3Result.key,
      fileSize: file.size,
      mimeType: file.mimetype,
      url: s3Result.url,
      thumbnailUrl
    });
    
    await media.save();
    return media;
  } catch (error) {
    console.error('Upload media service error:', error);
    throw new Error('Failed to upload media: ' + error.message);
  }
};

// Get media service
const getMediaService = async (conversationId, limit = 50, offset = 0) => {
  try {
    const media = await Media.find({ conversationId })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });
    
    return media;
  } catch (error) {
    console.error('Get media service error:', error);
    throw new Error('Failed to get media: ' + error.message);
  }
};

// Delete media service
const deleteMediaService = async (id) => {
  try {
    // Find media by ID
    const media = await Media.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }
    
    // Delete from S3
    await deleteFromS3(media.fileName);
    
    // Delete thumbnail if exists
    if (media.thumbnailUrl) {
      await deleteFromS3('thumb_' + media.originalName);
    }
    
    // Delete from database
    await Media.findByIdAndDelete(id);
  } catch (error) {
    console.error('Delete media service error:', error);
    throw new Error('Failed to delete media: ' + error.message);
  }
};

module.exports = {
  uploadMiddleware: upload.single('media'),
  uploadMediaService,
  getMediaService,
  deleteMediaService
};
