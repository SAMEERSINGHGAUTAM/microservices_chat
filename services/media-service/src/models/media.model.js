const mongoose = require('mongoose');

// Media schema
const mediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
mediaSchema.index({ userId: 1 });
mediaSchema.index({ conversationId: 1 });
mediaSchema.index({ type: 1 });

module.exports = mongoose.model('Media', mediaSchema);
