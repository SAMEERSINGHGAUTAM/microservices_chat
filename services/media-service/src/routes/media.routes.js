const express = require('express');
const router = express.Router();

const { uploadMedia, getMedia, deleteMedia } = require('../controllers/media.controller');

// Upload media
router.post('/upload', uploadMedia);

// Get media by conversation ID
router.get('/:conversationId', getMedia);

// Delete media
router.delete('/:id', deleteMedia);

module.exports = router;
