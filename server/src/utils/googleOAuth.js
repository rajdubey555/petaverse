const { OAuth2Client } = require('google-auth-library');
const { env } = require('../config/env');
const AppError = require('./AppError');

/**
 * Google OAuth Utility
 * Verifies the ID token (credential) returned by Google One Tap / Sign-In.
 */

/**
 * Verify Google ID token and return user profile.
 * Called when client sends credential from @react-oauth/google.
 *
 * @param {string} credential - The Google ID token (credential response)
 * @returns {Promise<Object>} - { googleId, email, name, picture, email_verified }
 * @throws {AppError} If token is invalid or verification fails
 */
const verifyGoogleToken = async (credential) => {
    const rawClientId = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientId = rawClientId ? rawClientId.trim() : null;

    if (!clientId) {
        throw new AppError(
            'Google OAuth is not configured. Set GOOGLE_CLIENT_ID in environment variables.',
            500
        );
    }

    const googleClient = new OAuth2Client(clientId);

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new AppError('Invalid Google token — no payload', 401);
        }

        // Verify email is present and verified
        if (!payload.email) {
            throw new AppError('Google account does not have an email address', 400);
        }

        if (!payload.email_verified) {
            throw new AppError('Google account email is not verified', 400);
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || 'Pet Lover',
            picture: payload.picture || '',
            emailVerified: payload.email_verified,
            locale: payload.locale,
        };
    } catch (error) {
        // If it's already our AppError, rethrow
        if (error instanceof AppError) {
            throw error;
        }

        // Google-specific errors
        if (error.message?.includes('Token used too late')) {
            throw new AppError('Google token has expired. Please sign in again.', 401);
        }

        if (error.message?.includes('Wrong recipient')) {
            throw new AppError('Google token audience mismatch. Check GOOGLE_CLIENT_ID in .env files.', 401);
        }

        console.error('Google Token Verification Error:', error);
        throw new AppError('Failed to verify Google authentication', 401);
    }
};

module.exports = { verifyGoogleToken };