const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { authMiddleware } = require('./middleware/auth.middleware');
const { rateLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler } = require('./middleware/errorHandler.middleware');
const { SERVICES } = require('./config/services.config');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// Proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/v1/auth'
  }
}));

app.use('/api/chat', authMiddleware, createProxyMiddleware({
  target: SERVICES.CHAT,
  changeOrigin: true,
  pathRewrite: {
    '^/api/chat': '/api/v1/chat'
  }
}));

app.use('/api/media', authMiddleware, createProxyMiddleware({
  target: SERVICES.MEDIA,
  changeOrigin: true,
  pathRewrite: {
    '^/api/media': '/api/v1/media'
  }
}));

app.use('/api/notifications', authMiddleware, createProxyMiddleware({
  target: SERVICES.NOTIFICATION,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api/v1/notifications'
  }
}));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
