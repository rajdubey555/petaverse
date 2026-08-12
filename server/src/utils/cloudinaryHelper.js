const { cloudinary } = require('../config/cloudinary');
const { UPLOAD, IMAGE_TRANSFORMATIONS } = require('./constants');
const AppError = require('./AppError');

/**
 * Cloudinary Helper Utilities
 * Upload, delete, and transform images via Cloudinary SDK.
 */

/**
 * Upload a single image to Cloudinary.
 *
 * @param {string} filePath - Local file path from Multer (temp storage)
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder (e.g., 'petaverse/pets')
 * @param {string} options.publicId - Optional custom public_id
 * @returns {Promise<Object>} { url, publicId, width, height, format, resourceType }
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadImage = async (filePath, options = {}) => {
    const { folder = UPLOAD.FOLDER_PETS, publicId } = options;

    let processedFilePath = filePath;
    let webpCreated = false;

    // Convert any uploaded image (JPG/PNG/GIF) to optimized WebP format using Sharp
    try {
        const parsedPath = path.parse(filePath);
        const webpPath = path.join(parsedPath.dir, `${parsedPath.name}-converted.webp`);

        await sharp(filePath)
            .rotate() // Auto-orient based on EXIF tag
            .resize({
                width: 1600,
                height: 1600,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: 82, effort: 4 })
            .toFile(webpPath);

        processedFilePath = webpPath;
        webpCreated = true;
    } catch (sharpError) {
        console.warn('⚠ Sharp WebP conversion skipped (using original file):', sharpError.message);
    }

    try {
        const result = await cloudinary.uploader.upload(processedFilePath, {
            folder,
            public_id: publicId,
            resource_type: 'image',
            format: 'webp',
            quality: 'auto',
            fetch_format: 'webp',
            tags: ['petaverse'],
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            invalidate: true,
        });

        if (webpCreated && fs.existsSync(processedFilePath)) {
            fs.unlink(processedFilePath, () => {});
        }

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: 'webp',
            resourceType: result.resource_type,
        };
    } catch (error) {
        console.warn('⚠ Cloudinary upload failed. Falling back to local file storage:', error.message);
        
        try {
            const baseName = path.basename(filePath, path.extname(filePath));
            const webpFileName = `petaverse-${Date.now()}-${baseName}.webp`;
            const targetDir = path.resolve(__dirname, '../../uploads');
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            const targetPath = path.join(targetDir, webpFileName);

            if (webpCreated && fs.existsSync(processedFilePath)) {
                fs.copyFileSync(processedFilePath, targetPath);
                fs.unlink(processedFilePath, () => {});
            } else {
                // Fallback sharp convert directly to targetPath
                await sharp(filePath)
                    .rotate()
                    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 82 })
                    .toFile(targetPath);
            }

            const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
            return {
                url: `${baseUrl}/uploads/${webpFileName}`,
                publicId: `local_${webpFileName}`,
                width: 1200,
                height: 900,
                format: 'webp',
                resourceType: 'image',
            };
        } catch (fallbackError) {
            console.error('Local Upload Fallback Error:', fallbackError.message);
            throw new AppError('Failed to process image upload.', 500);
        }
    }
};

/**
 * Upload multiple images to Cloudinary.
 *
 * @param {Array<Object>} files - Array of Multer file objects
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array<Object>>} Array of upload results
 */
const uploadMultipleImages = async (files, folder = UPLOAD.FOLDER_PETS) => {
    if (!files || files.length === 0) {
        throw new AppError('No files provided for upload', 400);
    }

    if (files.length > UPLOAD.MAX_FILES) {
        throw new AppError(
            `Maximum ${UPLOAD.MAX_FILES} images allowed per upload`,
            400
        );
    }

    try {
        const uploadPromises = files.map((file) =>
            uploadImage(file.path, { folder })
        );
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        // If any upload fails, attempt to clean up already uploaded images
        if (error.results) {
            const uploaded = error.results.filter((r) => r?.publicId);
            await Promise.allSettled(
                uploaded.map((r) => deleteImage(r.publicId))
            );
        }
        throw error;
    }
};

/**
 * Delete an image from Cloudinary by public_id.
 *
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
    if (!publicId) {
        throw new AppError('Public ID is required to delete an image', 400);
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true,
        });

        if (result.result !== 'ok' && result.result !== 'not found') {
            console.warn(`⚠ Cloudinary deletion unexpected result: ${result.result} for ${publicId}`);
        }

        return result;
    } catch (error) {
        console.error(`Cloudinary Delete Error for ${publicId}:`, error.message);
        // Don't throw — deletion failure shouldn't block the main operation
        return { result: 'error', error: error.message };
    }
};

/**
 * Delete multiple images from Cloudinary.
 *
 * @param {Array<string>} publicIds - Array of Cloudinary public_ids
 * @returns {Promise<Array<Object>>}
 */
const deleteMultipleImages = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) return [];
    const results = await Promise.allSettled(
        publicIds.map((id) => deleteImage(id))
    );
    return results;
};

/**
 * Generate a transformed image URL using Cloudinary transformations.
 *
 * @param {string} publicId - Cloudinary public_id
 * @param {string} transformationKey - Key from IMAGE_TRANSFORMATIONS constant
 * @returns {string} Transformed Cloudinary URL
 */
const getTransformedUrl = (publicId, transformationKey = 'DETAIL') => {
    if (!publicId) return '';

    const transformation = IMAGE_TRANSFORMATIONS[transformationKey];
    if (!transformation) return cloudinary.url(publicId, { secure: true });

    return cloudinary.url(publicId, {
        secure: true,
        transformation: [transformation],
    });
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    deleteMultipleImages,
    getTransformedUrl,
};