const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const tripRoutes = require('./routes/tripRoutes');

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/trips', tripRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Journal API',
    endpoints: {
      'GET /api/trips': 'Get all trips',
      'GET /api/trips/:id': 'Get single trip by ID'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// ⚠️ REMOVE the app.listen() from here
// Server will be started by server.js

module.exports = app;
