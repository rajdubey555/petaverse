const AppError = require('../utils/AppError');

/**
 * 404 Not Found Middleware
 * Catches all requests that didn't match any route.
 * Must be registered AFTER all routes but BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
    next(
        new AppError(`Cannot find ${req.originalUrl} on this server`, 404)
    );
};

module.exports = notFound;