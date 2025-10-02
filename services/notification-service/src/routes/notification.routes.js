const express = require('express');
const router = express.Router();

const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notification.controller');

// Get notifications for a user
router.get('/', getNotifications);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;
