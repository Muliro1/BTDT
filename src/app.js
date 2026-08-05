const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const tripRoutes = require('./routes/tripRoutes');

// Import error handler
const { errorHandler } = require('./middleware/errorHandler');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============
// All routes are now handled by tripRoutes
app.use('/', tripRoutes);  // Mount all routes at root

// ============ ERROR HANDLING ============

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global error handler (MUST BE LAST)
app.use(errorHandler);

module.exports = app;