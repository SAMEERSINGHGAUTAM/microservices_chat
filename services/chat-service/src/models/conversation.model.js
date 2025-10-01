const mongoose = require('mongoose');

// Conversation schema
const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
