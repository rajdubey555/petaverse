const express = require('express');
const authController = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const authValidation = require('./auth.validation');
const auth = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

/**
 * Auth Routes
 * Base path: /api/v1/auth
 *
 * Public Routes:
 *   POST /google   — Google OAuth login/registration
 *   POST /refresh  — Refresh expired access token
 *
 * Protected Routes (require valid access token):
 *   POST /logout   — Logout user (clear refresh token)
 *   GET  /me       — Get current authenticated user
 */

// Apply stricter rate limiting to all auth routes
router.use(authLimiter);

// ── Public Routes ──

/** Email/Password Registration */
router.post(
    '/register',
    validate(authValidation.register),
    authController.register
);

/** Email/Password Login */
router.post(
    '/login',
    validate(authValidation.login),
    authController.login
);

/** Google OAuth Login — verifies credential, creates/finds user, returns tokens */
router.post(
    '/google',
    validate(authValidation.googleLogin),
    authController.googleLogin
);

/** Refresh Token — reads refresh token from httpOnly cookie, rotates tokens */
router.post('/refresh', authController.refreshToken);

// ── Protected Routes ──

/** Logout — requires auth, clears refresh token from DB and cookie */
router.post('/logout', auth, authController.logout);

/** Get Current User — requires auth, returns authenticated user profile */
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;