const { env } = require('../config/env');

/**
 * Listing Types (matches Pet.listingType enum)
 */
const LISTING_TYPES = ['adoption', 'rehoming', 'sale', 'lost', 'found'];

/**
 * Listing Statuses (matches Pet.status enum)
 */
const LISTING_STATUSES = [
    'available',
    'pending',
    'adopted',
    'sold',
    'resolved',
    'removed',
];

/**
 * Species Options
 */
const SPECIES = [
    'dog',
    'cat',
    'bird',
    'fish',
    'rabbit',
    'hamster',
    'reptile',
    'other',
];

/**
 * Gender Options
 */
const GENDERS = ['male', 'female', 'unknown'];

/**
 * Size Options
 */
const SIZES = ['small', 'medium', 'large', 'xlarge'];

/**
 * Age Units
 */
const AGE_UNITS = ['days', 'weeks', 'months', 'years'];

/**
 * User Roles
 */
const ROLES = ['user', 'admin'];

/**
 * Contact Methods
 */
const CONTACT_METHODS = ['phone', 'email', 'platform'];

/**
 * Pagination Defaults
 */
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
};

/**
 * Upload Limits
 */
const UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 5,
    ALLOWED_MIME_TYPES: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ],
    FOLDER_PETS: 'petaverse/pets',
    FOLDER_AVATARS: 'petaverse/avatars',
};

/**
 * Rate Limiting
 */
const RATE_LIMIT = {
    GENERAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    GENERAL_MAX: 100,                    // 100 requests per window
    AUTH_WINDOW_MS: 15 * 60 * 1000,
    AUTH_MAX: 10,                        // 10 auth requests per window
    UPLOAD_WINDOW_MS: 60 * 60 * 1000,    // 1 hour
    UPLOAD_MAX: 20,                      // 20 uploads per hour
};

/**
 * Token Configuration
 */
const TOKEN = {
    ACCESS_EXPIRY: env.ACCESS_TOKEN_EXPIRY || '15m',
    REFRESH_EXPIRY: env.REFRESH_TOKEN_EXPIRY || '7d',
    REFRESH_EXPIRY_MS: env.REFRESH_TOKEN_EXPIRY_MS || 7 * 24 * 60 * 60 * 1000,
    COOKIE_NAME: 'refreshToken',
    COOKIE_OPTIONS: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: env.REFRESH_TOKEN_EXPIRY_MS || 7 * 24 * 60 * 60 * 1000,
        path: '/',
    },
};

/**
 * Cloudinary Image Transformations
 */
const IMAGE_TRANSFORMATIONS = {
    THUMBNAIL: { width: 400, height: 300, crop: 'fill', gravity: 'auto', quality: 'auto', fetch_format: 'auto' },
    DETAIL: { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    FULL: { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    AVATAR: { width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
    THUMB_SM: { width: 50, height: 50, crop: 'thumb', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
};

module.exports = {
    LISTING_TYPES,
    LISTING_STATUSES,
    SPECIES,
    GENDERS,
    SIZES,
    AGE_UNITS,
    ROLES,
    CONTACT_METHODS,
    PAGINATION,
    UPLOAD,
    RATE_LIMIT,
    TOKEN,
    IMAGE_TRANSFORMATIONS,
};