const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../utils/constants');

/**
 * Rate Limiter Middleware
 * Skipped in development mode for seamless testing.
 */

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// ── General Rate Limiter ──
const generalLimiter = rateLimit({
    windowMs: RATE_LIMIT.GENERAL_WINDOW_MS,
    max: RATE_LIMIT.GENERAL_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: {
        status: 'fail',
        message: 'Too many requests. Please try again later.',
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    },
});

// ── Auth Rate Limiter (stricter) ──
const authLimiter = rateLimit({
    windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
    max: RATE_LIMIT.AUTH_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: {
        status: 'fail',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    },
});

// ── Upload Rate Limiter ──
const uploadLimiter = rateLimit({
    windowMs: RATE_LIMIT.UPLOAD_WINDOW_MS,
    max: RATE_LIMIT.UPLOAD_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: {
        status: 'fail',
        message: 'Upload limit reached. Please try again later.',
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    },
});

module.exports = { generalLimiter, authLimiter, uploadLimiter };