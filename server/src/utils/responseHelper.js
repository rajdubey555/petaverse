/**
 * Standardized API Response Helpers
 * Ensures consistent response structure across all endpoints.
 *
 * Success Shape:
 *   { status: 'success', message, data, results?, pagination? }
 *
 * Error Shape (handled by errorHandler middleware):
 *   { status: 'fail'|'error', message, errors? }
 */

/**
 * Send a successful single-item response
 * @param {Object} res - Express response
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Human-readable message
 * @param {*} data - Response data (object, array, null)
 */
const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null } = {}) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

/**
 * Send a successful list response with pagination metadata
 * @param {Object} res - Express response
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Human-readable message
 * @param {Array} data - Array of items
 * @param {Object} pagination - { page, limit, totalPages, totalResults, hasNextPage, hasPrevPage }
 */
const sendListSuccess = (
    res,
    {
        statusCode = 200,
        message = 'Data retrieved successfully',
        data = [],
        pagination = {},
    } = {}
) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        results: pagination.totalResults ?? data.length,
        pagination: {
            page: pagination.page || 1,
            limit: pagination.limit || data.length,
            totalPages: pagination.totalPages || 1,
            totalResults: pagination.totalResults ?? data.length,
            hasNextPage: pagination.hasNextPage || false,
            hasPrevPage: pagination.hasPrevPage || false,
        },
        data,
    });
};

/**
 * Send a 201 Created response
 * @param {Object} res - Express response
 * @param {string} message - Human-readable message
 * @param {*} data - Created resource
 */
const sendCreated = (res, { message = 'Resource created successfully', data = null } = {}) => {
    return sendSuccess(res, { statusCode: 201, message, data });
};

/**
 * Send a 204 No Content response (used for delete operations)
 * @param {Object} res - Express response
 */
const sendNoContent = (res) => {
    return res.status(204).send();
};

module.exports = {
    sendSuccess,
    sendListSuccess,
    sendCreated,
    sendNoContent,
};