const SavedPet = require('../../models/SavedPet');
const Pet = require('../../models/Pet');
const AppError = require('../../utils/AppError');
const { PAGINATION } = require('../../utils/constants');

/**
 * SavedPet Service
 * Business logic for saving, unsaving, toggling, and listing saved pets.
 * Delegates logic to SavedPet model statics where applicable.
 */
const savedPetService = {
    /**
     * Toggle save/unsave a pet for the current user.
     * Uses SavedPet.toggle() static — creates if not saved, deletes if already saved.
     *
     * Validates that the pet exists and is active before toggling.
     *
     * @param {string} userId - Authenticated user's ID
     * @param {string} petId - Pet ID to toggle
     * @returns {Promise<{ saved: boolean, message: string }>}
     */
    toggleSave: async (userId, petId) => {
        // Verify the pet exists and is active
        const pet = await Pet.findById(petId).select('_id isActive name').lean();

        if (!pet) {
            throw new AppError('Pet not found. It may have been removed.', 404);
        }

        if (!pet.isActive) {
            throw new AppError(
                'This pet listing is no longer available.',
                410
            );
        }

        const { saved } = await SavedPet.toggle(userId, petId);

        return {
            saved,
            message: saved
                ? `"${pet.name}" has been saved to your favorites.`
                : `"${pet.name}" has been removed from your favorites.`,
        };
    },

    /**
     * Unsave (remove) a saved pet for the current user.
     * Direct delete — no toggle. Returns 404 if not previously saved.
     *
     * @param {string} userId - Authenticated user's ID
     * @param {string} petId - Pet ID to unsave
     * @returns {Promise<{ message: string }>}
     */
    unsavePet: async (userId, petId) => {
        const existing = await SavedPet.findOne({ user: userId, pet: petId });

        if (!existing) {
            throw new AppError(
                'This pet is not in your saved list. Nothing to remove.',
                404
            );
        }

        // Fetch pet name for a user-friendly response
        const pet = await Pet.findById(petId).select('name').lean();

        await existing.deleteOne();

        return {
            message: pet
                ? `"${pet.name}" has been removed from your saved list.`
                : 'Pet has been removed from your saved list.',
        };
    },

    /**
     * Check if a pet is saved by the current user.
     * Returns boolean — lightweight, no pet validation needed.
     *
     * @param {string} userId - Authenticated user's ID
     * @param {string} petId - Pet ID to check
     * @returns {Promise<{ saved: boolean }>}
     */
    checkSaved: async (userId, petId) => {
        const saved = await SavedPet.isSaved(userId, petId);

        return { saved };
    },

    /**
     * Get all saved pets for the current user with full pet details.
     * Paginated. Filters out inactive/deleted pets via populate match.
     * Uses SavedPet.getSavedPetsWithDetails() static.
     *
     * @param {string} userId - Authenticated user's ID
     * @param {Object} [options]
     * @param {number} [options.page=1]
     * @param {number} [options.limit=12]
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getUserSavedPets: async (userId, options = {}) => {
        const page = Math.max(1, parseInt(options.page, 10) || PAGINATION.DEFAULT_PAGE);
        const limit = Math.min(
            PAGINATION.MAX_LIMIT,
            Math.max(1, parseInt(options.limit, 10) || PAGINATION.DEFAULT_LIMIT)
        );

        const result = await SavedPet.getSavedPetsWithDetails(userId, {
            page,
            limit,
        });

        return {
            data: result.data,
            pagination: result.pagination,
        };
    },

    /**
     * Remove all saved pets for a user (used on account deletion).
     *
     * @param {string} userId
     * @returns {Promise<number>} Number of documents removed
     */
    removeAllForUser: async (userId) => {
        return await SavedPet.removeAllForUser(userId);
    },
};

module.exports = savedPetService;