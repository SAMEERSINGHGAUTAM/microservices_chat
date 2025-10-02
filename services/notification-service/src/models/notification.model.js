const mongoose = require('mongoose');

// Notification schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'system', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
