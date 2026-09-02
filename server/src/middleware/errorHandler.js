const AppError = require('../utils/AppError');

function notFoundHandler(_req, _res, next) {
  next(new AppError('Route not found', 404));
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };
