const adminService = require('./admin.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess, sendListSuccess } = require('../../utils/responseHelper');

/**
 * Admin Controller
 * Route handlers for admin dashboard and management operations.
 *
 * All endpoints require auth + admin middleware.
 *
 * Endpoints:
 * - GET    /api/v1/admin/dashboard        — Dashboard statistics
 * - GET    /api/v1/admin/users             — List all users
 * - GET    /api/v1/admin/pets              — List all pets
 * - GET    /api/v1/admin/reports           — List all reports
 * - PATCH  /api/v1/admin/users/:id/status  — Activate / deactivate user
 * - PATCH  /api/v1/admin/pets/:id/feature  — Feature / unfeature pet
 * - DELETE /api/v1/admin/pets/:id          — Soft delete pet listing
 */
const adminController = {
    /**
     * GET /api/v1/admin/dashboard
     * Returns aggregate statistics for the admin overview dashboard.
     */
    getDashboard: catchAsync(async (req, res) => {
        const dashboardData = await adminService.getDashboardStats();

        sendSuccess(res, {
            statusCode: 200,
            message: 'Dashboard statistics retrieved successfully.',
            data: dashboardData,
        });
    }),


    /**
     * GET /api/v1/admin/users
     * Returns paginated list of all users with filtering and search.
     */
    getUsers: catchAsync(async (req, res) => {
        const result = await adminService.getAllUsers(req.query);

        sendListSuccess(res, {
            statusCode: 200,
            message: 'Users retrieved successfully.',
            data: result.data,
            pagination: result.pagination,
        });
    }),

    /**
     * GET /api/v1/admin/pets
     * Returns paginated list of all pet listings (including inactive).
     */
    getPets: catchAsync(async (req, res) => {
        const result = await adminService.getAllPets(req.query);

        sendListSuccess(res, {
            statusCode: 200,
            message: 'Pet listings retrieved successfully.',
            data: result.data,
            pagination: result.pagination,
        });
    }),

    /**
     * GET /api/v1/admin/reports
     * Returns paginated list of all reports with reporter and pet populated.
     * Supports filtering by status: ?status=pending
     */
    getReports: catchAsync(async (req, res) => {
        const result = await adminService.getAllReports(req.query);

        sendListSuccess(res, {
            statusCode: 200,
            message: 'Reports retrieved successfully.',
            data: result.data,
            pagination: result.pagination,
        });
    }),

    /**
     * PATCH /api/v1/admin/users/:id/status
     * Toggles a user's active status (activate / deactivate).
     * Prevents admin from deactivating their own account.
     */
    toggleUserStatus: catchAsync(async (req, res) => {
        const { id } = req.params;
        const adminId = req.user._id;

        const { user, message } = await adminService.toggleUserStatus(
            id,
            adminId
        );

        sendSuccess(res, {
            statusCode: 200,
            message,
            data: { user },
        });
    }),

    /**
     * PATCH /api/v1/admin/pets/:id/feature
     * Toggles a pet listing's featured status (feature / unfeature).
     */
    togglePetFeature: catchAsync(async (req, res) => {
        const { id } = req.params;

        const { pet, message } = await adminService.togglePetFeature(id);

        sendSuccess(res, {
            statusCode: 200,
            message,
            data: { pet },
        });
    }),

    /**
     * DELETE /api/v1/admin/pets/:id
     * Soft deletes a pet listing (admin override — no ownership check).
     * Sets isActive=false, status='removed', isFeatured=false.
     */
    deletePet: catchAsync(async (req, res) => {
        const { id } = req.params;

        const { pet, message } = await adminService.deletePet(id);

        sendSuccess(res, {
            statusCode: 200,
            message,
            data: { pet },
        });
    }),

    /**
     * PATCH /api/v1/admin/reports/:id/status
     * Updates the status of a report (pending, reviewed, resolved, dismissed).
     */
    updateReportStatus: catchAsync(async (req, res) => {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const { report, message } = await adminService.updateReportStatus(id, {
            status,
            adminNotes,
        });

        sendSuccess(res, {
            statusCode: 200,
            message,
            data: { report },
        });
    }),
};

module.exports = adminController;