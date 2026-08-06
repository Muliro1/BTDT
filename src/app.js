const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

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

// ============ VIEW ENGINE ============
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ============ MIDDLEWARE ============
app.use(cors());                          // Enable CORS
app.use(morgan('dev'));                   // Logging
app.use(express.json());                  // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride('_method'));       // Override HTTP methods (for PUT/DELETE)
app.use(express.static(path.join(__dirname, 'public'))); // Static files

// ============ ROUTES ============
app.use('/', tripRoutes);

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

