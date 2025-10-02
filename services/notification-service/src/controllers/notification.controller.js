const Notification = require('../models/notification.model');
const { getNotificationsService, markAsReadService, deleteNotificationService } = require('../services/notification.service');

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { userId, limit, offset } = req.query;
    
    // Get notifications
    const notifications = await getNotificationsService(userId, limit, offset);
    
    res.status(200).json({
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mark notification as read
    const notification = await markAsReadService(id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.status(200).json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete notification
    const result = await deleteNotificationService(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.status(200).json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification
};
