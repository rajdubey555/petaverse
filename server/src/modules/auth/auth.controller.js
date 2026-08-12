const authService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');
const {
    sendSuccess,
    sendCreated,
} = require('../../utils/responseHelper');
const {
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
} = require('../../utils/jwt');
const AppError = require('../../utils/AppError');
const { TOKEN } = require('../../utils/constants');

/**
 * Auth Controller
 * HTTP request/response handler for authentication routes.
 * Delegates business logic to authService.
 * Handles cookie manipulation and response formatting.
 */
const authController = {
    /**
     * POST /api/v1/auth/register
     * Email/Password user registration.
     */
    register: catchAsync(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService.register(req.body);

        setRefreshTokenCookie(res, refreshToken);

        sendCreated(res, {
            message: 'Registration successful',
            data: {
                user,
                accessToken,
            },
        });
    }),

    /**
     * POST /api/v1/auth/login
     * Email/Password user login.
     */
    login: catchAsync(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService.login(req.body);

        setRefreshTokenCookie(res, refreshToken);

        sendSuccess(res, {
            message: 'Login successful',
            data: {
                user,
                accessToken,
            },
        });
    }),

    /**
     * POST /api/v1/auth/google
     * Google OAuth Login / Registration.
     * Accepts Google credential from @react-oauth/google,
     * verifies it, creates/finds user, and returns tokens.
     *
     * Access Token → response body (used as Bearer token)
     * Refresh Token → httpOnly secure cookie
     */
    googleLogin: catchAsync(async (req, res) => {
        const { credential } = req.body;

        const { user, accessToken, refreshToken } =
            await authService.googleLogin(credential);

        // Set refresh token as httpOnly cookie
        setRefreshTokenCookie(res, refreshToken);

        sendCreated(res, {
            message: 'Authentication successful',
            data: {
                user,
                accessToken,
            },
        });
    }),

    /**
     * POST /api/v1/auth/refresh
     * Refresh expired access token using refresh token from cookie.
     * Rotates both tokens for security.
     *
     * Requires: refresh token in httpOnly cookie
     */
    refreshToken: catchAsync(async (req, res) => {
        const tokenFromCookie = req.cookies[TOKEN.COOKIE_NAME];

        if (!tokenFromCookie) {
            throw new AppError(
                'No refresh token provided. Please sign in again.',
                401
            );
        }

        const { user, accessToken, refreshToken } =
            await authService.refreshAccessToken(tokenFromCookie);

        // Set new refresh token cookie
        setRefreshTokenCookie(res, refreshToken);

        sendSuccess(res, {
            message: 'Token refreshed successfully',
            data: {
                user,
                accessToken,
            },
        });
    }),

    /**
     * POST /api/v1/auth/logout
     * Clear refresh token from DB and cookie.
     * Requires authentication (auth middleware).
     *
     * Note: The access token is still technically valid until it expires,
     * but the refresh token is removed, preventing token renewal.
     */
    logout: catchAsync(async (req, res) => {
        await authService.logout(req.user._id);

        // Clear the refresh token cookie
        clearRefreshTokenCookie(res);

        sendSuccess(res, {
            message: 'Logged out successfully',
            data: null,
        });
    }),

    /**
     * GET /api/v1/auth/me
     * Get current authenticated user's profile.
     * Requires authentication (auth middleware).
     */
    getCurrentUser: catchAsync(async (req, res) => {
        const user = await authService.getCurrentUser(req.user._id);

        sendSuccess(res, {
            message: 'User profile retrieved successfully',
            data: { user },
        });
    }),
};

module.exports = authController;