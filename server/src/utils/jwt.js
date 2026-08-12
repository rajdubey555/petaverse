const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { TOKEN } = require('./constants');

/**
 * JWT Utility — Sign & Verify Access + Refresh Tokens
 */

/**
 * Generate an access token (short-lived)
 * @param {Object} payload - { userId, email, role }
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(
        {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRY || '15m' }
    );
};

/**
 * Generate a refresh token (long-lived)
 * @param {string} userId
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId,
            type: 'refresh',
        },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
};

/**
 * Verify an access token
 * @param {string} token
 * @returns {Object} Decoded payload { userId, email, role, iat, exp }
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

/**
 * Verify a refresh token
 * @param {string} token
 * @returns {Object} Decoded payload { userId, type, iat, exp }
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

/**
 * Generate both tokens for a user
 * @param {Object} user - Mongoose user document
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (user) => {
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(user._id.toString());

    return { accessToken, refreshToken };
};

/**
 * Set refresh token as httpOnly cookie on response
 * @param {Object} res - Express response object
 * @param {string} refreshToken
 */
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie(TOKEN.COOKIE_NAME, refreshToken, TOKEN.COOKIE_OPTIONS);
};

/**
 * Clear refresh token cookie (logout)
 * @param {Object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
    res.cookie(TOKEN.COOKIE_NAME, '', {
        ...TOKEN.COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
    });
};

/**
 * Extract Bearer token from Authorization header
 * @param {Object} req - Express request object
 * @returns {string|null} Token string or null
 */
const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokenPair,
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
    extractBearerToken,
};