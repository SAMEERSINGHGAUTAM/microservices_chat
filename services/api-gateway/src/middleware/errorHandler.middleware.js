// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Default error response
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Send error response
  res.status(status).json({
    error: {
      message,
      status
    }
  });
};

module.exports = { errorHandler };
