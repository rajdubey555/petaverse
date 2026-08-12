const reportService = require('./report.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess, sendListSuccess } = require('../../utils/responseHelper');

/**
 * Report Controller
 * HTTP request/response handlers for report endpoints.
 *
 * All routes require authentication (mounted in routes with `auth` middleware).
 * The authenticated user's ID is read from req.user._id (set by auth middleware).
 */
const reportController = {
    /**
     * POST /api/v1/reports
     * File a report against a pet listing.
     *
     * Body: { petId, reason, description? }
     *
     * Validates:
     *  - Pet exists and is active
     *  - User is not reporting their own pet
     *  - Duplicate reports are rejected by the compound unique index
     *
     * Returns 201 for new reports, 200 for duplicate (already reported).
     */
    createReport: catchAsync(async (req, res) => {
        const { petId, reportedUserId, reason, description } = req.body;
        const reporterId = req.user._id;

        const result = await reportService.createReport(
            reporterId,
            { petId, reportedUserId },
            reason,
            description
        );

        sendSuccess(res, {
            statusCode: result.isNew ? 201 : 200,
            message: result.message,
            data: {
                reportId: result.report._id,
                isNew: result.isNew,
                status: result.report.status,
                reason: result.report.reason,
                createdAt: result.report.createdAt,
            },
        });
    }),

    /**
     * GET /api/v1/reports/my-reports
     * Get all reports filed by the current user.
     * Paginated, with pet details populated.
     *
     * Query params: page (default 1), limit (default 20, max 50)
     */
    getMyReports: catchAsync(async (req, res) => {
        const userId = req.user._id;
        const { page, limit } = req.query;

        const { data, pagination } = await reportService.getMyReports(userId, {
            page,
            limit,
        });

        sendListSuccess(res, {
            statusCode: 200,
            message: 'Your reports retrieved successfully',
            data,
            pagination,
        });
    }),

    /**
     * DELETE /api/v1/reports/:id
     * Delete (withdraw) a report filed by the current user.
     *
     * Constraints:
     *  - Only the original reporter can delete their report
     *  - Only pending reports can be deleted
     */
    deleteReport: catchAsync(async (req, res) => {
        const { id } = req.params;
        const userId = req.user._id;

        const result = await reportService.deleteReport(id, userId);

        sendSuccess(res, {
            statusCode: 200,
            message: result.message,
            data: null,
        });
    }),
};

module.exports = reportController;