const userService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess, sendListSuccess } = require('../../utils/responseHelper');
const { clearRefreshTokenCookie } = require('../../utils/jwt');

/**
 * User Controller
 * Route handlers for user profile operations.
 *
 * Endpoints:
 * - GET    /api/v1/users/:id          — Public: Get user profile
 * - PATCH  /api/v1/users/profile      — Auth: Update own profile
 * - DELETE /api/v1/users/account      — Auth: Soft delete own account
 * - GET    /api/v1/users/:id/listings — Public: Get user's active listings
 */
const userController = {
    /**
     * GET /api/v1/users/:id
     * Public: Returns safe profile data for any user.
     * Includes listingCount and savedCount virtuals.
     */
    getPublicProfile: catchAsync(async (req, res) => {
        const { id } = req.params;

        const user = await userService.getPublicProfile(id);

        sendSuccess(res, {
            statusCode: 200,
            message: 'User profile retrieved successfully.',
            data: { user },
        });
    }),

    /**
     * PATCH /api/v1/users/profile
     * Auth Required: Updates the authenticated user's profile.
     * Only whitelisted fields (name, bio, phone, avatar, location)
     * are accepted. Role/email/refreshToken modification is blocked.
     */
    updateProfile: catchAsync(async (req, res) => {
        const userId = req.user._id;
        const updateData = req.body;

        const user = await userService.updateProfile(userId, updateData);

        sendSuccess(res, {
            statusCode: 200,
            message: 'Profile updated successfully.',
            data: { user },
        });
    }),

    /**
     * DELETE /api/v1/users/account
     * Auth Required: Soft deletes the authenticated user's account.
     * Sets isActive=false, clears refresh tokens, and removes
     * the refresh token cookie.
     */
    deleteAccount: catchAsync(async (req, res) => {
        const userId = req.user._id;

        await userService.deleteAccount(userId);

        // Clear the refresh token cookie so the user is fully logged out
        clearRefreshTokenCookie(res);

        sendSuccess(res, {
            statusCode: 200,
            message:
                'Your account has been deactivated successfully. We\'re sorry to see you go.',
            data: null,
        });
    }),

    /**
     * GET /api/v1/users/:id/listings
     * Public: Returns paginated active pet listings for a given user.
     * Only returns listings where isActive=true.
     */
    getUserListings: catchAsync(async (req, res) => {
        const { id } = req.params;
        const queryParams = req.query;

        const result = await userService.getUserListings(id, queryParams);

        sendListSuccess(res, {
            statusCode: 200,
            message: 'User listings retrieved successfully.',
            data: result.data,
            pagination: result.pagination,
        });
    }),

    /**
     * POST /api/v1/users/:id/rate
     * Auth Required: Submit or update rating for a user profile.
     */
    rateUser: catchAsync(async (req, res) => {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const result = await userService.rateUser(id, req.user, { rating, comment });

        sendSuccess(res, {
            statusCode: 200,
            message: 'User rating submitted successfully.',
            data: result,
        });
    }),
};

module.exports = userController;