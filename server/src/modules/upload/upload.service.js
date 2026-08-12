const {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
} = require('../../utils/cloudinaryHelper');
const { UPLOAD } = require('../../utils/constants');
const AppError = require('../../utils/AppError');

/**
 * Upload Service
 * Orchestrates file uploads from temp storage (Multer) to Cloudinary.
 * Delegates Cloudinary operations to cloudinaryHelper utilities.
 */
const uploadService = {
    /**
     * Upload a single image to Cloudinary.
     *
     * @param {Object} file - Multer file object ({ path, originalname, mimetype })
     * @param {string} [folder='petaverse/pets'] - Cloudinary destination folder
     * @returns {Promise<Object>} { url, publicId, width, height, format, resourceType }
     */
    uploadSingle: async (file, folder = UPLOAD.FOLDER_PETS) => {
        if (!file) {
            throw new AppError('No file provided for upload.', 400);
        }

        const result = await uploadImage(file.path, { folder });

        return result;
    },

    /**
     * Upload multiple images to Cloudinary.
     * Enforces the MAX_FILES limit and validates the input.
     *
     * @param {Array<Object>} files - Array of Multer file objects
     * @param {string} [folder='petaverse/pets'] - Cloudinary destination folder
     * @returns {Promise<Array<Object>>} Array of upload results
     */
    uploadMultiple: async (files, folder = UPLOAD.FOLDER_PETS) => {
        if (!files || files.length === 0) {
            throw new AppError('No files provided for upload.', 400);
        }

        if (files.length > UPLOAD.MAX_FILES) {
            throw new AppError(
                `Maximum ${UPLOAD.MAX_FILES} images allowed. Received ${files.length}.`,
                400
            );
        }

        const results = await uploadMultipleImages(files, folder);

        return results;
    },

    /**
     * Delete an image from Cloudinary by its public_id.
     *
     * @param {string} publicId - Cloudinary public_id to delete
     * @returns {Promise<Object>} Deletion result from Cloudinary
     */
    deleteImage: async (publicId) => {
        if (!publicId || typeof publicId !== 'string' || !publicId.trim()) {
            throw new AppError('A valid Cloudinary public_id is required.', 400);
        }

        const result = await deleteImage(publicId.trim());

        return result;
    },
};

module.exports = uploadService;