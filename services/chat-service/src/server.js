const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/database');
const connectRedis = require('./config/redis');
const chatRoutes = require('./routes/chat.routes');
const { initializeSocket } = require('./socket/socket.handler');

const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Connect to Redis
connectRedis();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Chat Service' });
});

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

initializeSocket(io);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
