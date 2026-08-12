/**
 * Custom Application Error Class
 * Extends native Error with HTTP status code, status string, and operational flag.
 *
 * Operational errors are expected errors that we can send meaningful messages about
 * (validation failures, not found, unauthorized, etc.)
 *
 * Programming errors (bugs) are NOT operational and should not be created with this class.
 */
class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code (4xx client error, 5xx server error)
     */
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Capture stack trace, excluding constructor from it
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;