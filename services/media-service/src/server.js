const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const mediaRoutes = require('./routes/media.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/media', mediaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Media Service' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Media Service running on port ${PORT}`);
});
