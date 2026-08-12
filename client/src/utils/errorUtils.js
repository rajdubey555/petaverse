/**
 * Error Utilities — Centralized error handling helpers.
 *
 * Used by:
 * - store/index.js (toastMiddleware) → extractErrorMessage
 * - RTK Query onQueryStarted error handlers
 * - Components for conditional error rendering
 */

/**
 * Extract a human-readable error message from various error shapes.
 *
 * Handles:
 * - RTK Query error payload: { data: { message }, status }
 * - Standard Error objects: { message }
 * - Mongoose validation: { data: { errors: [...] } }
 * - Joi validation: { data: { message: "...", errors: [...] } }
 * - Network errors: { error: "FETCH_ERROR" }
 * - String errors
 * - Unknown shapes (returns generic fallback)
 *
 * @param {*} error - The error object from RTK Query or catch block
 * @returns {string} Human-readable error message
 */
export const extractErrorMessage = (error) => {
    if (!error) return 'An unexpected error occurred. Please try again.';

    // String error
    if (typeof error === 'string') return error;

    // Error instance
    if (error instanceof Error) return error.message;

    // RTK Query fetchBaseQuery error shape
    if (error.data?.message) return error.data.message;

    // Mongoose/Express validation error with errors array
    if (error.data?.errors && Array.isArray(error.data.errors)) {
        return error.data.errors.map((e) => e.message || e.msg).join('. ');
    }

    // Express validation with top-level message
    if (error.data?.error) return error.data.error;

    // Status code-based messages
    if (error.status) {
        const statusMessages = {
            400: 'Invalid request. Please check your input.',
            401: 'Session expired. Please sign in again.',
            403: 'You do not have permission to perform this action.',
            404: 'The requested resource was not found.',
            409: 'A conflict occurred. Please try again.',
            413: 'File is too large.',
            429: 'Too many requests. Please slow down.',
            500: 'Server error. Please try again later.',
            503: 'Service temporarily unavailable.',
        };
        if (statusMessages[error.status]) return statusMessages[error.status];
        return `Error ${error.status}: Something went wrong.`;
    }

    // Network / fetch errors
    if (error.error === 'FETCH_ERROR') {
        return 'Network error. Please check your internet connection.';
    }
    if (error.error === 'TIMEOUT_ERROR') {
        return 'Request timed out. Please try again.';
    }

    // Fallback: try to stringify the message if it exists
    if (error.message) return error.message;

    return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if the error is a network connectivity error.
 * @param {*} error
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
    if (!error) return false;
    return (
        error.error === 'FETCH_ERROR' ||
        error.status === 'FETCH_ERROR' ||
        error.message === 'Failed to fetch' ||
        error.message === 'NetworkError when attempting to fetch resource.' ||
        (error instanceof TypeError && error.message === 'Failed to fetch')
    );
};

/**
 * Check if the error is an authentication error (401).
 * @param {*} error
 * @returns {boolean}
 */
export const isAuthError = (error) => {
    if (!error) return false;
    return error.status === 401;
};

/**
 * Check if the error is a server error (500+).
 * @param {*} error
 * @returns {boolean}
 */
export const isServerError = (error) => {
    if (!error) return false;
    return error.status >= 500 && error.status < 600;
};

/**
 * Check if the error is a validation error (400).
 * @param {*} error
 * @returns {boolean}
 */
export const isValidationError = (error) => {
    if (!error) return false;
    return error.status === 400 || (error.data?.errors && Array.isArray(error.data.errors));
};

/**
 * Check if the error is a not-found error (404).
 * @param {*} error
 * @returns {boolean}
 */
export const isNotFoundError = (error) => {
    if (!error) return false;
    return error.status === 404;
};