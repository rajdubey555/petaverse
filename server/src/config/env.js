const path = require('path');

// Load .env file only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

/**
 * Centralized environment configuration with validation and defaults.
 * All env access should go through this module — never use process.env directly.
 */
const env = {
  // ── Server ──
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // ── MongoDB ──
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/petaverse',

  // ── JWT ──
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  REFRESH_TOKEN_EXPIRY_MS:
    parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS, 10) || 7 * 24 * 60 * 60 * 1000,

  // ── Google OAuth ──
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  // ── Cloudinary ──
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // ── Client ──
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

/**
 * Validates that all required environment variables are present.
 * Throws on startup if any required variable is missing.
 */
function validateEnv() {
  const required = [
    { key: 'ACCESS_TOKEN_SECRET', minLength: 32 },
    { key: 'REFRESH_TOKEN_SECRET', minLength: 32 },
    { key: 'GOOGLE_CLIENT_ID' },
    { key: 'CLOUDINARY_CLOUD_NAME' },
    { key: 'CLOUDINARY_API_KEY' },
    { key: 'CLOUDINARY_API_SECRET' },
  ];

  const missing = [];
  const tooShort = [];

  for (const { key, minLength } of required) {
    if (!env[key]) {
      missing.push(key);
    } else if (minLength && env[key].length < minLength) {
      tooShort.push(`${key} (min ${minLength} chars, got ${env[key].length})`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  - ${missing.join('\n  - ')}\n\n` +
        `Please check your .env file against .env.example`
    );
  }

  if (tooShort.length > 0) {
    throw new Error(
      `Environment variables are too short:\n  - ${tooShort.join('\n  - ')}\n\n` +
        `Secrets should be at least 32 characters long for security.`
    );
  }

  // Warn about default JWT secrets in production
  if (env.NODE_ENV === 'production') {
    // MongoDB URI check
    if (
      env.MONGODB_URI.includes('localhost') ||
      env.MONGODB_URI.includes('127.0.0.1')
    ) {
      console.warn(
        '⚠ WARNING: Using localhost MongoDB in production environment!'
      );
    }

    // Client URL cross-origin check
    if (env.CLIENT_URL === 'http://localhost:5173') {
      console.warn(
        '⚠ WARNING: CLIENT_URL is still set to localhost in production!'
      );
    }
  }

  console.log('✅ Environment variables validated successfully');
}

module.exports = { env, validateEnv };