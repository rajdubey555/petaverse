const morgan = require('morgan');
const { env } = require('../config/env');

/**
 * Request Logger Middleware
 *
 * Development: 'dev' format (colored, concise — method, url, status, response-time)
 * Production: 'combined' format (Apache combined log format — IP, referrer, user-agent)
 */
const logger = morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev');

module.exports = logger;