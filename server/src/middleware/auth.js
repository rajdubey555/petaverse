const { verifyAccessToken, extractBearerToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Authentication Middleware
 * Verifies JWT access token from Authorization header.
 * Attaches the user document to req.user.
 *
 * Usage:
 *   router.get('/profile', auth, userController.getProfile);
 */
const auth = catchAsync(async (req, res, next) => {
    // 1. Extract token from Authorization header
    const token = extractBearerToken(req);

    if (!token) {
        throw new AppError(
            'Access denied. No authentication token provided.',
            401
        );
    }

    // 2. Verify token (throws if expired or invalid)
    let decoded;
    try {
        decoded = verifyAccessToken(token);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError(
                'Your session has expired. Please refresh your token or sign in again.',
                401
            );
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid authentication token.', 401);
        }
        throw error;
    }

    // 3. Find user (ensure they still exist and are active)
    const user = await User.findById(decoded.userId).select(
        '-refreshToken -refreshTokenExpiresAt'
    );

    if (!user) {
        throw new AppError(
            'The user belonging to this token no longer exists.',
            401
        );
    }

    if (!user.isActive) {
        throw new AppError(
            'Your account has been deactivated. Please contact support.',
            403
        );
    }

    // 4. Grant access — attach user to request
    req.user = user;
    next();
});

module.exports = auth;