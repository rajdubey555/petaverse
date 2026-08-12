const Report = require('../../models/Report');
const Pet = require('../../models/Pet');
const AppError = require('../../utils/AppError');
const { PAGINATION } = require('../../utils/constants');

/**
 * Report Service
 * Business logic for reporting pet listings, listing user reports, and deleting reports.
 * Delegates report creation and admin queries to Report model statics.
 */
const reportService = {
    /**
     * File a report against a pet listing.
     * Uses Report.fileReport() static which prevents duplicate reports via
     * the compound unique index { reporter, pet }.
     *
     * Validates:
     *  - Pet exists and is active
     *  - User is not reporting their own pet (prevents self-report abuse)
     *
     * @param {string} reporterId - Authenticated user's ID
     * @param {string|Object} targetData - Pet ID or object with petId/reportedUserId
     * @param {string} reason - Report reason (must match Report enum)
     * @param {string} [description=''] - Optional details
     * @returns {Promise<{ report: Object, isNew: boolean, message: string }>}
     */
    createReport: async (reporterId, targetData, reason, description = '') => {
        let petId = null;
        let reportedUserId = null;

        if (typeof targetData === 'object' && targetData !== null) {
            petId = targetData.petId || null;
            reportedUserId = targetData.reportedUserId || targetData.reportedUser || null;
        } else {
            petId = targetData;
        }

        if (reportedUserId) {
            if (String(reportedUserId) === String(reporterId)) {
                throw new AppError('You cannot report your own account profile.', 403);
            }
        } else if (petId) {
            const pet = await Pet.findById(petId).select('_id isActive owner name').lean();
            if (!pet) {
                throw new AppError('Pet listing not found. It may have been removed.', 404);
            }
            if (!pet.isActive) {
                throw new AppError('This pet listing is no longer available.', 410);
            }
            if (String(pet.owner) === String(reporterId)) {
                throw new AppError('You cannot report your own pet listing.', 403);
            }
        }

        const { report, isNew } = await Report.fileReport(
            reporterId,
            { petId, reportedUserId },
            reason,
            description
        );

        return {
            report,
            isNew,
            message: isNew
                ? 'Thank you. Your report has been submitted to admin for review.'
                : 'You have already reported this item/user. Admin is reviewing your report.',
        };
    },

    /**
     * Get all reports filed by the current user.
     * Paginated, with pet details populated.
     *
     * @param {string} userId - Authenticated user's ID
     * @param {Object} [options]
     * @param {number} [options.page=1]
     * @param {number} [options.limit=20]
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getMyReports: async (userId, options = {}) => {
        const page = Math.max(1, parseInt(options.page, 10) || PAGINATION.DEFAULT_PAGE);
        const limit = Math.min(
            PAGINATION.MAX_LIMIT,
            Math.max(1, parseInt(options.limit, 10) || 20)
        );

        const skip = (page - 1) * limit;
        const filter = { reporter: userId };

        const [data, total] = await Promise.all([
            Report.find(filter)
                .sort('-createdAt')
                .skip(skip)
                .limit(limit)
                .populate('pet', 'name species breed listingType status images.url isActive')
                .lean(),
            Report.countDocuments(filter),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                totalResults: total,
                totalPages: Math.ceil(total / limit) || 1,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };
    },

    /**
     * Delete a report filed by the current user.
     * Only the original reporter can delete their own report.
     * Only pending reports can be deleted (reviewed/resolved reports cannot).
     *
     * @param {string} reportId - Report ID to delete
     * @param {string} userId - Authenticated user's ID (must match reporter)
     * @returns {Promise<{ message: string }>}
     */
    deleteReport: async (reportId, userId) => {
        const report = await Report.findById(reportId).select('reporter status').lean();

        if (!report) {
            throw new AppError('Report not found. It may have already been deleted.', 404);
        }

        // Ownership check: only the reporter can delete their own report
        if (report.reporter.toString() !== userId.toString()) {
            throw new AppError(
                'You can only delete your own reports.',
                403
            );
        }

        // Status check: only pending reports can be deleted
        if (report.status !== 'pending') {
            throw new AppError(
                `This report has already been ${report.status} and cannot be deleted.`,
                400
            );
        }

        await Report.findByIdAndDelete(reportId);

        return {
            message: 'Your report has been withdrawn successfully.',
        };
    },

    /**
     * Get report count for a pet. Useful for displaying on the frontend.
     *
     * @param {string} petId
     * @returns {Promise<number>}
     */
    getReportCountForPet: async (petId) => {
        return await Report.getReportCountForPet(petId);
    },
};

module.exports = reportService;