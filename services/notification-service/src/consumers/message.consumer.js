const { getChannel } = require('../config/rabbitmq');
const Notification = require('../models/notification.model');
const { sendEmailNotification } = require('../services/email.service');
const { sendPushNotification } = require('../services/fcm.service');

// Consume messages from RabbitMQ
const consumeMessages = async () => {
  try {
    const channel = getChannel();
    
    // Consume messages from queue
    channel.consume('message_notifications', async (msg) => {
      if (msg !== null) {
        try {
          // Parse message
          const messageData = JSON.parse(msg.content.toString());
          
          // Create notification in database
          const notification = new Notification({
            userId: messageData.userId,
            type: 'message',
            title: messageData.title,
            content: messageData.content,
            metadata: messageData.metadata || {}
          });
          
          await notification.save();
          
          // Send email notification
          await sendEmailNotification(messageData.userId, messageData.title, messageData.content);
          
          // Send push notification
          await sendPushNotification(messageData.userId, messageData.title, messageData.content);
          
          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error('Message processing error:', error);
          // Reject message and put it back in queue
          channel.nack(msg, false, true);
        }
      }
    });
    
    console.log('Message consumer started');
  } catch (error) {
    console.error('Message consumer error:', error);
  }
};

module.exports = { consumeMessages };
