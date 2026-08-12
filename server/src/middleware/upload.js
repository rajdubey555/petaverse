const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');
const { UPLOAD } = require('../utils/constants');

/**
 * Multer Upload Middleware
 * Handles temporary file storage before Cloudinary upload.
 * Files are deleted after Cloudinary upload (or on error).
 */

// ── Ensure temp upload directory exists ──
const uploadDir = path.resolve(__dirname, '../../temp/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Disk Storage Configuration ──
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `petaverse-${uniqueSuffix}${ext}`);
    },
});

// ── File Filter ──
const fileFilter = (req, file, cb) => {
    if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `Invalid file type: ${file.mimetype}. Allowed: ${UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`,
                400
            ),
            false
        );
    }
};

// ── Multer Instance ──
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: UPLOAD.MAX_FILE_SIZE, // 5MB
        files: UPLOAD.MAX_FILES,        // 5 files max
    },
});

// ── Pre-configured Middleware Exports ──

/**
 * Accept a single image file.
 * Field name: 'image'
 */
const uploadSingle = upload.single('image');

/**
 * Accept multiple image files.
 * Field name: 'images', max: 5
 */
const uploadMultiple = upload.array('images', UPLOAD.MAX_FILES);

/**
 * Cleanup temporary files after processing.
 * Should be called after Cloudinary upload succeeds or fails.
 *
 * @param {Array|Object} files - Multer file(s)
 */
const cleanupTempFiles = (files) => {
    const fileList = Array.isArray(files) ? files : files ? [files] : [];

    for (const file of fileList) {
        if (file?.path) {
            fs.unlink(file.path, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.warn(`⚠ Failed to delete temp file: ${file.path}`, err.message);
                }
            });
        }
    }
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    cleanupTempFiles,
    uploadDir,
};