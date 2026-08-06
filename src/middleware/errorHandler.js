// Centralized Error Handling Middleware

/**
 * Custom error class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', err);
  
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  
  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  
  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(error => error.message);
    message = errors.join(', ');
  }
  
  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists. Please use a different value.`;
  }
  
  // Check if request expects JSON or HTML
  const acceptsHtml = req.accepts('html');
  const acceptsJson = req.accepts('json');
  
  // If HTML is preferred and it's a 404 or 500, render error page
  if (acceptsHtml && !acceptsJson && (statusCode === 404 || statusCode === 500)) {
    return res.status(statusCode).render('error', {
      title: statusCode === 404 ? 'Page Not Found' : 'Server Error',
      message: message
    });
  }
  
  // Default: Send JSON response for API
  res.status(statusCode).json({
    success: false,
    message: message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  AppError,
  errorHandler
};

