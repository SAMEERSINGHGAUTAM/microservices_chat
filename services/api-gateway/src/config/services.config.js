// Service URLs configuration
const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  CHAT: process.env.CHAT_SERVICE_URL || 'http://localhost:3002',
  MEDIA: process.env.MEDIA_SERVICE_URL || 'http://localhost:3003',
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004'
};

module.exports = { SERVICES };
