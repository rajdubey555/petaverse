const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const {
    generateTokenPair,
    verifyRefreshToken,
} = require('../../utils/jwt');
const { verifyGoogleToken } = require('../../utils/googleOAuth');
const { TOKEN } = require('../../utils/constants');

/**
 * Auth Service
 * Business logic for authentication operations.
 * Handles Google OAuth login, token refresh, logout, and current user retrieval.
 */
const authService = {
    /**
     * Email/Password Registration
     * Creates a new user with email and hashed password.
     */
    register: async ({ name, email, password, phone, location }) => {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new AppError('An account with this email address already exists.', 409);
        }

        const user = await User.create({
            name,
            email,
            password,
            phone: phone || '',
            location: location || { city: '', state: '', country: '' },
            lastLoginAt: new Date(),
        });

        const { accessToken, refreshToken } = generateTokenPair(user);
        const refreshExpiresAt = new Date(Date.now() + TOKEN.REFRESH_EXPIRY_MS);
        await user.setRefreshToken(refreshToken, refreshExpiresAt);

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        delete userObj.refreshTokenExpiresAt;

        return {
            user: userObj,
            accessToken,
            refreshToken,
        };
    },

    /**
     * Email/Password Login
     * Authenticates user credentials and generates JWT tokens.
     */
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            throw new AppError('Invalid email or password.', 401);
        }

        if (!user.isActive) {
            throw new AppError('Your account has been deactivated. Please contact support.', 403);
        }

        user.lastLoginAt = new Date();
        const { accessToken, refreshToken } = generateTokenPair(user);
        const refreshExpiresAt = new Date(Date.now() + TOKEN.REFRESH_EXPIRY_MS);
        await user.setRefreshToken(refreshToken, refreshExpiresAt);

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        delete userObj.refreshTokenExpiresAt;

        return {
            user: userObj,
            accessToken,
            refreshToken,
        };
    },

    /**
     * Google OAuth Login
     * Verifies the Google ID token, finds or creates the user, and generates JWT tokens.
     *
     * @param {string} credential - Google ID token from @react-oauth/google
     * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
     */
    googleLogin: async (credential) => {
        // 1. Verify Google ID token
        const googleProfile = await verifyGoogleToken(credential);

        // 2. Find existing user or create new one
        const user = await User.findOrCreateFromGoogle(googleProfile);

        // 3. Check if user is deactivated
        if (!user.isActive) {
            throw new AppError(
                'Your account has been deactivated. Please contact support.',
                403
            );
        }

        // 4. Generate JWT token pair
        const { accessToken, refreshToken } = generateTokenPair(user);

        // 5. Store refresh token on user document (with expiry)
        const refreshExpiresAt = new Date(
            Date.now() + TOKEN.REFRESH_EXPIRY_MS
        );
        await user.setRefreshToken(refreshToken, refreshExpiresAt);

        // 6. Return user without sensitive fields
        const userObj = user.toObject();
        delete userObj.refreshToken;
        delete userObj.refreshTokenExpiresAt;

        return {
            user: userObj,
            accessToken,
            refreshToken,
        };
    },

    /**
     * Refresh Access Token
     * Validates the refresh token, rotates tokens, and returns a new pair.
     * Implements secure refresh token rotation — each use invalidates the old token.
     *
     * @param {string} refreshToken - Refresh token from httpOnly cookie
     * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
     */
    refreshAccessToken: async (refreshToken) => {
        // 1. Verify refresh token JWT
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError(
                    'Refresh token has expired. Please sign in again.',
                    401
                );
            }
            if (error.name === 'JsonWebTokenError') {
                throw new AppError('Invalid refresh token. Please sign in again.', 401);
            }
            throw new AppError('Token verification failed. Please sign in again.', 401);
        }

        // 2. Find user WITH refresh token fields (normally excluded via select: false)
        const user = await User.findById(decoded.userId).select(
            '+refreshToken +refreshTokenExpiresAt'
        );

        if (!user) {
            throw new AppError(
                'User belonging to this token no longer exists.',
                401
            );
        }

        if (!user.isActive) {
            throw new AppError(
                'Your account has been deactivated. Please contact support.',
                403
            );
        }

        // 3. Verify the stored token matches and is not expired
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            // Token mismatch — possible token reuse/theft. Clear all tokens.
            await user.clearRefreshToken();
            throw new AppError(
                'Invalid or reused refresh token. Please sign in again.',
                401
            );
        }

        if (!user.hasValidRefreshToken()) {
            await user.clearRefreshToken();
            throw new AppError(
                'Refresh token has expired. Please sign in again.',
                401
            );
        }

        // 4. Rotate — generate new token pair
        const tokens = generateTokenPair(user);

        // 5. Store new refresh token (invalidates the old one)
        const refreshExpiresAt = new Date(
            Date.now() + TOKEN.REFRESH_EXPIRY_MS
        );
        await user.setRefreshToken(tokens.refreshToken, refreshExpiresAt);

        // 6. Return user without sensitive fields
        const userObj = user.toObject();
        delete userObj.refreshToken;
        delete userObj.refreshTokenExpiresAt;

        return {
            user: userObj,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    },

    /**
     * Logout
     * Clears the refresh token from the user document.
     *
     * @param {string} userId - Authenticated user's ID
     * @returns {Promise<void>}
     */
    logout: async (userId) => {
        const user = await User.findById(userId).select(
            '+refreshToken +refreshTokenExpiresAt'
        );

        if (user) {
            await user.clearRefreshToken();
        }
    },

    /**
     * Get Current User
     * Returns the authenticated user's complete profile.
     *
     * @param {string} userId - Authenticated user's ID
     * @returns {Promise<Object>} User document
     */
    getCurrentUser: async (userId) => {
        const user = await User.findById(userId)
            .select('-refreshToken -refreshTokenExpiresAt')
            .lean();

        if (!user) {
            throw new AppError('User not found.', 404);
        }

        if (!user.isActive) {
            throw new AppError(
                'Your account has been deactivated. Please contact support.',
                403
            );
        }

        return user;
    },
};

module.exports = authService;