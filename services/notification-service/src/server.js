const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const connectRabbitMQ = require('./config/rabbitmq');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Connect to database
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Notification Service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
