const mongoose = require('mongoose');

/**
 * Report Model
 * Allows users to report problematic listings (spam, inappropriate, fraud, etc.)
 * Admin reviews reports from the admin dashboard.
 *
 * Collection: reports
 */
const reportSchema = new mongoose.Schema(
    {
        // ── Reporter (who filed the report) ──
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Report must have a reporter'],
            index: true,
        },

        // ── Reported Pet (which listing was reported, optional if reporting user) ──
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
            default: null,
            index: true,
        },

        // ── Reported User (if reporting a user profile directly) ──
        reportedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },

        // ── Report Type ──
        targetType: {
            type: String,
            enum: ['pet', 'user'],
            default: 'pet',
        },

        // ── Report Details ──
        reason: {
            type: String,
            required: [true, 'Report reason is required'],
            enum: {
                values: [
                    'spam',
                    'inappropriate_content',
                    'misleading_information',
                    'fraudulent_listing',
                    'already_adopted_sold',
                    'duplicate_listing',
                    'incorrect_species_breed',
                    'harmful_or_dangerous',
                    'user_impersonation',
                    'harassment_or_abuse',
                    'scam_or_fake_profile',
                    'unresponsive_or_ghosting',
                    'inappropriate_behavior',
                    'other',
                ],
                message: '{VALUE} is not a valid report reason',
            },
        },
        description: {
            type: String,
            maxlength: [1000, 'Report description cannot exceed 1000 characters'],
            default: '',
        },

        // ── Admin Resolution ──
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
            default: 'pending',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        adminNotes: {
            type: String,
            maxlength: [500, 'Admin notes cannot exceed 500 characters'],
            default: '',
        },

        // ── Resolution Action ──
        resolution: {
            type: String,
            enum: ['none', 'warning_issued', 'listing_removed', 'user_suspended', 'dismissed'],
            default: 'none',
        },
    },
    {
        timestamps: true,
    }
);

// ── Indexes ──

/** Compound unique: a user can only report a pet once */
reportSchema.index({ reporter: 1, pet: 1 }, { unique: true });

/** Quick lookup: all reports against a specific pet */
reportSchema.index({ pet: 1, status: 1 });

/** Admin queue: pending reports sorted by oldest first */
reportSchema.index({ status: 1, createdAt: 1 });

// ── Statics ──

/**
 * File a report. If already reported by this user, returns the existing report.
 *
 * @param {string} reporterId
 * @param {string} petId
 * @param {string} reason
 * @param {string} [description='']
 * @returns {Promise<{ report: Document, isNew: boolean }>}
 */
reportSchema.statics.fileReport = async function (
    reporterId,
    target, // { petId, reportedUserId }
    reason,
    description = ''
) {
    let petId = null;
    let reportedUserId = null;
    let targetType = 'pet';

    if (typeof target === 'object' && target !== null) {
        petId = target.petId || null;
        reportedUserId = target.reportedUserId || target.reportedUser || null;
        targetType = reportedUserId ? 'user' : 'pet';
    } else {
        petId = target;
        targetType = 'pet';
    }

    const queryFilter = { reporter: reporterId };
    if (reportedUserId) {
        queryFilter.reportedUser = reportedUserId;
    } else {
        queryFilter.pet = petId;
    }

    const existing = await this.findOne(queryFilter);

    if (existing) {
        return { report: existing, isNew: false };
    }

    const report = await this.create({
        reporter: reporterId,
        pet: petId,
        reportedUser: reportedUserId,
        targetType,
        reason,
        description,
    });

    return { report, isNew: true };
};

/**
 * Get pending reports with reporter, pet, and reportedUser populated.
 */
reportSchema.statics.getPendingReports = async function ({
    page = 1,
    limit = 20,
} = {}) {
    const skip = (page - 1) * limit;
    const filter = { status: 'pending' };

    const [data, total] = await Promise.all([
        this.find(filter)
            .sort('createdAt')
            .skip(skip)
            .limit(limit)
            .populate('reporter', 'name email avatar.url')
            .populate('reportedUser', 'name email avatar.url location')
            .populate('pet', 'name species breed listingType status images.url owner')
            .lean(),
        this.countDocuments(filter),
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
};

/**
 * Resolve a report (admin action).
 *
 * @param {string} reportId
 * @param {string} adminId
 * @param {string} resolution
 * @param {string} [adminNotes='']
 * @returns {Promise<Document>}
 */
reportSchema.statics.resolveReport = async function (
    reportId,
    adminId,
    resolution,
    adminNotes = ''
) {
    return this.findByIdAndUpdate(
        reportId,
        {
            $set: {
                status: 'resolved',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                resolution,
                adminNotes,
            },
        },
        { new: true }
    );
};

/**
 * Get report count per pet. Useful for admin dashboard.
 *
 * @param {string} petId
 * @returns {Promise<number>}
 */
reportSchema.statics.getReportCountForPet = async function (petId) {
    return this.countDocuments({ pet: petId });
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;