const express = require('express');
const uploadController = require('./upload.controller');
const auth = require('../../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../../middleware/upload');
const { uploadLimiter } = require('../../middleware/rateLimiter');
const AppError = require('../../utils/AppError');
const { cleanupTempFiles } = require('../../middleware/upload');

const router = express.Router();

/**
 * Upload Routes
 * Base path: /api/v1/upload
 *
 * All routes require authentication.
 * Stricter rate limiting applied (20 req/hour per IP).
 *
 * File validation is handled by Multer middleware:
 *  - MIME types: jpeg, jpg, png, webp only
 *  - Max size: 5MB per file
 *  - Max count: 5 files per request
 *
 * Protected Routes:
 *   POST   /single   — Upload single image (field: 'image')
 *   POST   /multiple — Upload multiple images (field: 'images', max 5)
 *   DELETE /         — Delete image by publicId
 */

// ── Multer Error Handler Middleware ──
// Multer errors (file too large, too many files, invalid type) are thrown
// before the controller runs. This middleware catches and formats them.

const handleMulterErrors = (err, req, res, next) => {
    if (err) {
        // Clean up any temp files that may have been written before the error
        if (req.file) cleanupTempFiles(req.file);
        if (req.files) cleanupTempFiles(req.files);

        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(
                new AppError(
                    'File size exceeds the 5MB limit. Please upload a smaller image.',
                    400
                )
            );
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
            return next(
                new AppError(
                    'Too many files. Maximum 5 images allowed per upload.',
                    400
                )
            );
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(
                new AppError(
                    `Unexpected file field: "${err.field}". Use "image" for single or "images" for multiple uploads.`,
                    400
                )
            );
        }

        // Custom AppError from fileFilter (invalid MIME type)
        if (err instanceof AppError) {
            return next(err);
        }

        // Other Multer errors
        return next(new AppError(err.message || 'File upload failed.', 400));
    }

    next();
};

// Apply upload rate limiter and auth to all routes
router.use(uploadLimiter);
router.use(auth);

// ── Upload Routes ──

/**
 * POST /api/v1/upload/single
 * Upload a single image. Field name must be 'image'.
 */
router.post(
    '/single',
    (req, res, next) => {
        uploadSingle(req, res, (err) => handleMulterErrors(err, req, res, next));
    },
    uploadController.uploadSingle
);

/**
 * POST /api/v1/upload/multiple
 * Upload multiple images. Field name must be 'images'.
 * Max 5 files per request (enforced by Multer).
 */
router.post(
    '/multiple',
    (req, res, next) => {
        uploadMultiple(req, res, (err) => handleMulterErrors(err, req, res, next));
    },
    uploadController.uploadMultiple
);

/**
 * DELETE /api/v1/upload
 * Delete an image from Cloudinary by public_id.
 * Body: { publicId: "petaverse/pets/abc123" }
 */
router.delete('/', uploadController.deleteImage);

module.exports = router;