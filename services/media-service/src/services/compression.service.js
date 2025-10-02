const sharp = require('sharp');

// Compress image
const compressImage = async (buffer) => {
  try {
    // Compress image using sharp
    const compressedBuffer = await sharp(buffer)
      .jpeg({ quality: 80 })
      .toBuffer();
    
    return compressedBuffer;
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image: ' + error.message);
  }
};

// Compress video (mock implementation)
const compressVideo = async (buffer) => {
  try {
    // In a real application, you would use a video compression library
    // For now, we'll just return the original buffer
    console.log('Video compression would happen here in a real application');
    return buffer;
  } catch (error) {
    console.error('Video compression error:', error);
    throw new Error('Failed to compress video: ' + error.message);
  }
};

module.exports = {
  compressImage,
  compressVideo
};
