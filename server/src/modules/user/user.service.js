const User = require('../../models/User');
const Pet = require('../../models/Pet');
const SavedPet = require('../../models/SavedPet');
const AppError = require('../../utils/AppError');
const APIFeatures = require('../../utils/apiFeatures');
const { PAGINATION } = require('../../utils/constants');

/**
 * User Service
 * Business logic for user profile operations.
 *
 * Security: Prevents role modification, email modification, and
 * direct refreshToken manipulation. Only whitelisted fields are
 * allowed during profile updates.
 */
const userService = {
    /**
     * Get Public User Profile
     * Returns safe, non-sensitive profile data for any user.
     *
     * @param {string} userId - Target user's MongoDB ObjectId
     * @returns {Promise<Object>} Public user profile
     */
    getPublicProfile: async (userId) => {
        const user = await User.findById(userId)
            .select('name avatar bio location role createdAt isActive ratings phone email')
            .lean();

        if (!user) {
            throw new AppError('User not found.', 404);
        }

        if (!user.isActive) {
            throw new AppError('This user account is no longer active.', 410);
        }

        const ratingsList = user.ratings || [];
        const sum = ratingsList.reduce((acc, r) => acc + (r.rating || 5), 0);
        const averageRating = ratingsList.length > 0 ? Math.round((sum / ratingsList.length) * 10) / 10 : 0;

        // Fetch counts in parallel
        const [listingCount, savedCount] = await Promise.all([
            Pet.countDocuments({ owner: userId, isActive: true }),
            SavedPet.countDocuments({ user: userId }),
        ]);

        return {
            ...user,
            averageRating,
            ratingCount: ratingsList.length,
            listingCount,
            savedCount,
        };
    },

    /**
     * Submit a rating and review for a user.
     */
    rateUser: async (targetUserId, reviewerUser, { rating, comment }) => {
        const user = await User.findById(targetUserId);
        if (!user || !user.isActive) {
            throw new AppError('User profile not found.', 404);
        }

        if (String(reviewerUser._id) === String(targetUserId)) {
            throw new AppError('You cannot rate your own profile.', 400);
        }

        user.ratings = user.ratings || [];
        const existingIndex = user.ratings.findIndex(
            (r) => String(r.reviewer) === String(reviewerUser._id)
        );

        const newRatingData = {
            reviewer: reviewerUser._id,
            reviewerName: reviewerUser.name || 'Anonymous User',
            reviewerAvatar: reviewerUser.avatar?.url || '',
            rating: Number(rating),
            comment: comment ? String(comment).trim() : '',
            createdAt: new Date(),
        };

        if (existingIndex > -1) {
            user.ratings[existingIndex] = newRatingData;
        } else {
            user.ratings.push(newRatingData);
        }

        await user.save();

        const sum = user.ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = Math.round((sum / user.ratings.length) * 10) / 10;

        return {
            averageRating,
            ratingCount: user.ratings.length,
            ratings: user.ratings,
        };
    },

    /**
     * Update Own Profile
     * Whitelists allowed fields to prevent privilege escalation and
     * sensitive data modification.
     *
     * Allowed fields: name, bio, phone, avatar, location
     * Blocked fields: role, email, googleId, refreshToken,
     *                  refreshTokenExpiresAt, isActive, lastLoginAt,
     *                  createdAt, updatedAt
     *
     * @param {string} userId - Authenticated user's ID (req.user._id)
     * @param {Object} updateData - Request body (already validated by Joi)
     * @returns {Promise<Object>} Updated user document
     */
    updateProfile: async (userId, updateData) => {
        // 1. Verify user exists and is active
        const existingUser = await User.findById(userId).lean();
        if (!existingUser) {
            throw new AppError('User not found.', 404);
        }
        if (!existingUser.isActive) {
            throw new AppError(
                'Your account has been deactivated. Profile updates are not allowed.',
                403
            );
        }

        // 2. Whitelist allowed fields — prevent sensitive field modification
        const allowedFields = ['name', 'bio', 'phone', 'avatar', 'location'];
        const sanitizedData = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                sanitizedData[field] = updateData[field];
            }
        }

        // 3. Ensure at least one valid field to update
        if (Object.keys(sanitizedData).length === 0) {
            throw new AppError(
                'At least one valid field (name, bio, phone, avatar, location) must be provided.',
                400
            );
        }

        // 4. Update with runValidators to enforce schema constraints
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: sanitizedData },
            { new: true, runValidators: true }
        )
            .select('-refreshToken -refreshTokenExpiresAt')
            .lean();

        return updatedUser;
    },

    /**
     * Soft Delete Own Account
     * Sets isActive=false and clears all refresh tokens.
     * The user can no longer authenticate but their data
     * (listings, etc.) is preserved for referential integrity.
     *
     * @param {string} userId - Authenticated user's ID
     * @returns {Promise<void>}
     */
    deleteAccount: async (userId) => {
        const user = await User.findById(userId).select(
            '+refreshToken +refreshTokenExpiresAt'
        );

        if (!user) {
            throw new AppError('User not found.', 404);
        }

        if (!user.isActive) {
            throw new AppError(
                'Your account has already been deactivated.',
                410
            );
        }

        // Soft delete + clear tokens
        user.isActive = false;
        user.refreshToken = null;
        user.refreshTokenExpiresAt = null;
        await user.save();
    },

    /**
     * Get User's Active Pet Listings
     * Returns paginated, active listings for a given user.
     * Only returns listings where isActive=true.
     *
     * @param {string} userId - Target user's MongoDB ObjectId
     * @param {Object} queryParams - Express req.query (page, limit, sort)
     * @returns {Promise<{ pets: Array, pagination: Object }>}
     */
    getUserListings: async (userId, queryParams) => {
        // 1. Verify the user exists and is active
        const user = await User.findById(userId).select('_id isActive name').lean();
        if (!user) {
            throw new AppError('User not found.', 404);
        }
        if (!user.isActive) {
            throw new AppError('This user account is no longer active.', 410);
        }

        // 2. Build base filter: owned by user + active listings only
        const baseFilter = {
            owner: userId,
            isActive: true,
        };

        // 3. Apply APIFeatures (pagination, sorting, field limiting, population)
        const features = new APIFeatures(
            Pet.find(baseFilter),
            queryParams
        )
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .populate();

        // 4. Execute query with count for pagination metadata
        const result = await features.executeWithCount(Pet, baseFilter);

        return result;
    },
};

module.exports = userService;