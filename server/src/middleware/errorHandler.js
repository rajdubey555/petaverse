const AppError = require('../utils/AppError');
const { env } = require('../config/env');

/**
 * Global Error Handling Middleware
 * Catches all errors thrown or passed via next(error).
 * Provides different response shapes for development vs production.
 *
 * Must be registered LAST in the Express middleware stack.
 */

// ── Handle Mongoose CastError (invalid ObjectId format) ──
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// ── Handle Mongoose Duplicate Key Error (code 11000) ──
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue).join(', ');
  const message = `Duplicate value for field: ${field}. Please use another value.`;
  return new AppError(message, 409);
};

// ── Handle Mongoose ValidationError ──
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// ── Handle JWT Errors ──
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// ── Development Error Response (verbose) ──
const sendErrorDev = (err, req, res) => {
  console.error('❌ ERROR:', err);

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// ── Production Error Response (clean) ──
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  console.error('❌ UNEXPECTED ERROR:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

// ── Main Error Handler ──
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
  }

  // Production: transform known errors into operational AppErrors
  let error = { ...err, message: err.message, name: err.name };

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return sendErrorProd(error, req, res);
};

module.exports = errorHandler;