const mongoose = require('mongoose');

/**
 * SavedPet Model
 * Junction collection for N:M relationship between Users and Pets.
 *
 * Collection: savedpets
 *
 * Key Design Decisions:
 * - Separate collection (not embedded in User) — prevents User doc bloat
 * - Compound unique index { user, pet } prevents duplicate saves
 * - Toggle pattern: create to save, delete to unsave
 * - createdAt only (no updatedAt needed)
 */
const savedPetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
            required: [true, 'Pet reference is required'],
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// ── Indexes ──

/** Compound unique: a user can only save a pet once */
savedPetSchema.index({ user: 1, pet: 1 }, { unique: true });

/** Quick lookup: all saved pets for a user */
savedPetSchema.index({ user: 1 });

/** Quick lookup: count saves for a pet */
savedPetSchema.index({ pet: 1 });

// ── Statics ──

/**
 * Toggle save/unsave for a pet.
 * If already saved: removes the record (unsave).
 * If not saved: creates the record (save).
 *
 * @param {string} userId
 * @param {string} petId
 * @returns {Promise<{ saved: boolean, doc: Document|null }>}
 */
savedPetSchema.statics.toggle = async function (userId, petId) {
    const existing = await this.findOne({ user: userId, pet: petId });

    if (existing) {
        await existing.deleteOne();
        return { saved: false, doc: null };
    }

    const doc = await this.create({ user: userId, pet: petId });
    return { saved: true, doc };
};

/**
 * Check if a pet is saved by a specific user.
 *
 * @param {string} userId
 * @param {string} petId
 * @returns {Promise<boolean>}
 */
savedPetSchema.statics.isSaved = async function (userId, petId) {
    if (!userId || !petId) return false;
    const doc = await this.findOne({ user: userId, pet: petId }).lean();
    return !!doc;
};

/**
 * Get all pet IDs saved by a user (lightweight — ObjectIds only).
 *
 * @param {string} userId
 * @returns {Promise<Array<string>>}
 */
savedPetSchema.statics.getSavedPetIds = async function (userId) {
    const docs = await this.find({ user: userId }).select('pet').lean();
    return docs.map((d) => d.pet.toString());
};

/**
 * Get all saved pets for a user with full pet data populated.
 *
 * @param {string} userId
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=12]
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
savedPetSchema.statics.getSavedPetsWithDetails = async function (
    userId,
    { page = 1, limit = 12 } = {}
) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        this.find({ user: userId })
            .sort('-createdAt')
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'pet',
                match: { isActive: true },
                populate: { path: 'owner', select: 'name avatar.url' },
            })
            .lean(),
        this.countDocuments({ user: userId }),
    ]);

    // Filter out any where pet was null (deleted/inactive)
    const filteredData = data.filter((item) => item.pet !== null);

    return {
        data: filteredData,
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
 * Bulk remove all saved pets for a user. Used on account deletion.
 *
 * @param {string} userId
 * @returns {Promise<number>} Number of documents removed
 */
savedPetSchema.statics.removeAllForUser = async function (userId) {
    const result = await this.deleteMany({ user: userId });
    return result.deletedCount;
};

const SavedPet = mongoose.model('SavedPet', savedPetSchema);

module.exports = SavedPet;