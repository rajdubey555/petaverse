const User = require('../../models/User');
const Pet = require('../../models/Pet');
const Report = require('../../models/Report');
const AppError = require('../../utils/AppError');
const APIFeatures = require('../../utils/apiFeatures');

/**
 * Admin Service
 * Business logic for admin dashboard and management operations.
 *
 * All operations require admin-level authorization (checked by middleware).
 */
const adminService = {
    /**
     * Get Dashboard Statistics
     * Returns aggregate counts for the admin dashboard overview.
     *
     * @returns {Promise<Object>} Dashboard stats
     */
    getDashboardStats: async () => {
        const [
            totalUsers,
            activeUsers,
            totalPets,
            activeListings,
            totalReports,
            pendingReports,
            resolvedReports,
            featuredListings,
            viewsAggregation,
            recentPets,
            recentUsers,
            recentReports,
            speciesAggregation,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Pet.countDocuments(),
            Pet.countDocuments({ isActive: true }),
            Report.countDocuments(),
            Report.countDocuments({ status: 'pending' }),
            Report.countDocuments({ status: { $in: ['resolved', 'dismissed'] } }),
            Pet.countDocuments({ isFeatured: true, isActive: true }),
            Pet.aggregate([{ $group: { _id: null, totalViews: { $sum: '$viewCount' } } }]),
            Pet.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('owner', 'name email avatar')
                .lean(),
            User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email avatar role isActive createdAt location')
                .lean(),
            Report.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('reporter', 'name email avatar')
                .populate('pet', 'name species breed images')
                .populate('reportedUser', 'name email avatar')
                .lean(),
            Pet.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$species', count: { $sum: 1 } } },
            ]),
        ]);

        const totalViews = viewsAggregation[0]?.totalViews || 0;
        const speciesBreakdown = {};
        speciesAggregation.forEach((s) => {
            if (s._id) speciesBreakdown[s._id] = s.count;
        });

        return {
            stats: {
                totalUsers,
                activeUsers,
                deactivatedUsers: totalUsers - activeUsers,
                totalPets,
                activeListings,
                inactiveListings: totalPets - activeListings,
                totalReports,
                pendingReports,
                resolvedReports,
                featuredListings,
                totalViews,
            },
            recentPets,
            recentUsers,
            recentReports,
            speciesBreakdown,
        };
    },


    /**
     * Get All Users (Admin View)
     * Returns paginated, filterable list of all users.
     *
     * @param {Object} queryParams - Express req.query (page, limit, sort, filters)
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getAllUsers: async (queryParams) => {
        const query = User.find().populate('listingCount');
        const features = new APIFeatures(query, queryParams)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();

        const result = await features.executeWithCount(User);

        return result;
    },

    /**
     * Get All Pet Listings (Admin View)
     * Returns paginated, filterable list of all pets including inactive ones.
     *
     * @param {Object} queryParams - Express req.query (page, limit, sort, filters)
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getAllPets: async (queryParams) => {
        const query = Pet.find().populate('owner', 'name email avatar phone location');
        const features = new APIFeatures(query, queryParams)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate()
            .populate();

        const result = await features.executeWithCount(Pet);

        return result;
    },

    /**
     * Get All Reports (Admin View)
     * Returns paginated, filterable list of all reports with
     * reporter and pet details populated.
     *
     * Supports filtering by status via ?status=pending
     *
     * @param {Object} queryParams - Express req.query (page, limit, sort, status filter)
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getAllReports: async (queryParams) => {
        const query = Report.find()
            .populate('reporter', 'name email avatar')
            .populate('pet', 'name species breed images owner')
            .populate('reportedUser', 'name email avatar');

        const features = new APIFeatures(query, queryParams)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();

        const result = await features.executeWithCount(Report);

        return result;
    },


    /**
     * Toggle User Active Status (Activate / Deactivate)
     * Prevents self-deactivation (admin cannot deactivate their own account).
     *
     * @param {string} userId - Target user's MongoDB ObjectId
     * @param {string} adminId - Admin performing the action (req.user._id)
     * @returns {Promise<{ user: Object, message: string }>}
     */
    toggleUserStatus: async (userId, adminId) => {
        // 1. Find the target user
        const user = await User.findById(userId).select(
            '+refreshToken +refreshTokenExpiresAt'
        );

        if (!user) {
            throw new AppError('User not found.', 404);
        }

        // 2. Prevent self-deactivation
        if (user._id.toString() === adminId.toString()) {
            throw new AppError(
                'You cannot change your own account status.',
                403
            );
        }

        // 3. Toggle isActive
        const newStatus = !user.isActive;
        user.isActive = newStatus;

        // 4. If deactivating, clear refresh tokens to force logout
        if (!newStatus) {
            user.refreshToken = null;
            user.refreshTokenExpiresAt = null;
        }

        await user.save();

        // 5. Return sanitized user (without sensitive fields)
        const userObj = user.toObject();
        delete userObj.refreshToken;
        delete userObj.refreshTokenExpiresAt;

        const action = newStatus ? 'activated' : 'deactivated';

        return {
            user: userObj,
            message: `User "${user.name}" has been ${action} successfully.`,
        };
    },

    /**
     * Toggle Pet Featured Status (Feature / Unfeature)
     * Featured pets appear prominently on the platform.
     *
     * @param {string} petId - Pet listing's MongoDB ObjectId
     * @returns {Promise<{ pet: Object, message: string }>}
     */
    togglePetFeature: async (petId) => {
        // 1. Find the pet
        const pet = await Pet.findById(petId).lean();

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        // 2. Toggle isFeatured
        const newFeatured = !pet.isFeatured;
        const updatedPet = await Pet.findByIdAndUpdate(
            petId,
            { $set: { isFeatured: newFeatured } },
            { new: true }
        ).lean();

        const action = newFeatured ? 'featured' : 'unfeatured';

        return {
            pet: updatedPet,
            message: `"${updatedPet.name}" has been ${action} successfully.`,
        };
    },

    /**
     * Soft Delete Pet Listing (Admin)
     * Allows admin to remove any pet listing regardless of ownership.
     * Sets isActive=false.
     *
     * @param {string} petId - Pet listing's MongoDB ObjectId
     * @returns {Promise<Object>} Deleted pet info
     */
    deletePet: async (petId) => {
        // 1. Find the pet
        const pet = await Pet.findById(petId).lean();

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        if (!pet.isActive) {
            throw new AppError(
                'This pet listing has already been removed.',
                410
            );
        }

        // 2. Soft delete
        const deletedPet = await Pet.findByIdAndUpdate(
            petId,
            { $set: { isActive: false, status: 'removed', isFeatured: false } },
            { new: true }
        ).lean();

        return {
            pet: deletedPet,
            message: `"${deletedPet.name}" has been removed successfully by admin.`,
        };
    },

    /**
     * Update Report Status (Admin)
     * Updates status of a report to pending, reviewed, resolved, or dismissed.
     *
     * @param {string} reportId
     * @param {string} status - 'pending' | 'reviewed' | 'resolved' | 'dismissed'
     * @param {string} [adminNotes]
     * @returns {Promise<{ report: Object, message: string }>}
     */
    updateReportStatus: async (reportId, { status, adminNotes }) => {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new AppError('Report not found.', 404);
        }

        report.status = status;
        if (adminNotes !== undefined) report.adminNotes = adminNotes;
        if (status === 'resolved' || status === 'reviewed') {
            report.reviewedAt = new Date();
        }

        await report.save();
        const updatedReport = await Report.findById(reportId)
            .populate('reporter', 'name email avatar')
            .populate('pet', 'name species breed images')
            .populate('reportedUser', 'name email avatar')
            .lean();

        return {
            report: updatedReport,
            message: `Report status updated to ${status}.`,
        };
    },
};

module.exports = adminService;