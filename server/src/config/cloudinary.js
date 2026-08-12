const cloudinary = require('cloudinary').v2;
const { env } = require('./env');

/**
 * Cloudinary v2 SDK Configuration.
 * Uses environment variables from centralized env module.
 */
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Verify Cloudinary connection on startup.
 * Pings the API to confirm credentials are valid.
 */
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log(`✅ Cloudinary Connected: ${result.status === 'ok' ? 'OK' : 'FAIL'} (${env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME})`);
        return true;
    } catch (error) {
        console.error(`❌ Cloudinary Connection Error: ${error.message}`);
        return false;
    }
};

module.exports = { cloudinary, testCloudinaryConnection };