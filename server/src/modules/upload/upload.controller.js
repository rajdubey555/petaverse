const uploadService = require('./upload.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess } = require('../../utils/responseHelper');
const { cleanupTempFiles } = require('../../middleware/upload');
const AppError = require('../../utils/AppError');
const { UPLOAD } = require('../../utils/constants');

/**
 * Upload Controller
 * HTTP request/response handler for image upload routes.
 *
 * Flow: Multer (temp disk) → Cloudinary → cleanup temp files → respond.
 * Temp files are ALWAYS cleaned up — on success OR error.
 */
const uploadController = {
    /**
     * POST /api/v1/upload/single
     * Upload a single image to Cloudinary.
     * Expects form-data field: 'image'
     *
     * Guards:
     *  - Auth required
     *  - File must exist (handled before Multer by the route)
     *  - File type/size validated by Multer middleware
     */
    uploadSingle: catchAsync(async (req, res) => {
        const file = req.file;

        if (!file) {
            throw new AppError(
                'No image file provided. Please attach an image under the "image" field.',
                400
            );
        }

        try {
            const result = await uploadService.uploadSingle(file);

            sendSuccess(res, {
                statusCode: 201,
                message: 'Image uploaded successfully',
                data: result,
            });
        } finally {
            // Always clean up temp files regardless of outcome
            cleanupTempFiles(file);
        }
    }),

    /**
     * POST /api/v1/upload/multiple
     * Upload multiple images to Cloudinary (max 5).
     * Expects form-data field: 'images' (multiple files)
     *
     * Guards:
     *  - Auth required
     *  - Files must exist
     *  - File count, types, sizes validated by Multer middleware
     */
    uploadMultiple: catchAsync(async (req, res) => {
        const files = req.files;

        if (!files || files.length === 0) {
            throw new AppError(
                'No image files provided. Please attach images under the "images" field.',
                400
            );
        }

        try {
            const results = await uploadService.uploadMultiple(files);

            sendSuccess(res, {
                statusCode: 201,
                message: `${results.length} image${results.length !== 1 ? 's' : ''} uploaded successfully`,
                data: results,
            });
        } finally {
            // Always clean up temp files regardless of outcome
            cleanupTempFiles(files);
        }
    }),

    /**
     * DELETE /api/v1/upload
     * Delete an image from Cloudinary by its public_id.
     * Expects JSON body: { publicId: string }
     *
     * Guards:
     *  - Auth required
     *  - valid publicId string
     */
    deleteImage: catchAsync(async (req, res) => {
        const { publicId } = req.body;

        if (!publicId) {
            throw new AppError(
                'Cloudinary public_id is required to delete an image.',
                400
            );
        }

        const result = await uploadService.deleteImage(publicId);

        sendSuccess(res, {
            message:
                result.result === 'ok'
                    ? 'Image deleted successfully'
                    : 'Image not found or already deleted',
            data: result,
        });
    }),
};

module.exports = uploadController;