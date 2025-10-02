const Notification = require('../models/notification.model');

// Get notifications for a user
const getNotificationsService = async (userId, limit = 50, offset = 0) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    
    return notifications;
  } catch (error) {
    throw new Error('Failed to get notifications: ' + error.message);
  }
};

// Mark notification as read
const markAsReadService = async (id) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    throw new Error('Failed to mark notification as read: ' + error.message);
  }
};

// Delete notification
const deleteNotificationService = async (id) => {
  try {
    const notification = await Notification.findByIdAndDelete(id);
    return notification;
  } catch (error) {
    throw new Error('Failed to delete notification: ' + error.message);
  }
};

module.exports = {
  getNotificationsService,
  markAsReadService,
  deleteNotificationService
};
