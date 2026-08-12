const Pet = require('../../models/Pet');
const AppError = require('../../utils/AppError');
const APIFeatures = require('../../utils/apiFeatures');
const { PAGINATION } = require('../../utils/constants');

/**
 * Pet Service
 * Business logic for pet listing operations.
 * Handles CRUD, search, featured listings, view counting, and ownership validation.
 */
const petService = {
    /**
     * Get paginated, filtered, sorted list of active pet listings.
     * Uses APIFeatures for reusable query building.
     *
     * @param {Object} queryParams - Parsed and validated req.query
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    getPets: async (queryParams) => {
        const { search, ...filterParams } = queryParams;

        // Build features on a lean query for performance
        const features = new APIFeatures(
            Pet.find().lean(),
            filterParams
        )
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .populate();

        // Apply text search separately (APIFeatures handles the $text operator)
        if (search) {
            features.query = features.query.find({
                $text: { $search: search },
            });
        }

        // Execute query with count for pagination metadata
        const { data, pagination } = await features.executeWithCount(Pet, {
            isActive: true,
        });

        return { data, pagination };
    },

    /**
     * Get a single pet listing by ID with populated owner details.
     *
     * @param {string} petId - Pet document ID
     * @returns {Promise<Object>} Pet document (plain object via lean)
     * @throws {AppError} If pet not found or inactive
     */
    getPetById: async (petId) => {
        const pet = await Pet.findById(petId)
            .populate('owner', 'name avatar.url location.city location.state')
            .lean();

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        if (!pet.isActive) {
            throw new AppError('This pet listing is no longer available.', 410);
        }

        return pet;
    },

    /**
     * Create a new pet listing.
     * The authenticated user is set as the owner.
     *
     * @param {Object} data - Validated pet data from request body
     * @param {string} ownerId - Authenticated user ID (req.user._id)
     * @returns {Promise<Object>} Created pet document
     */
    createPet: async (data, ownerId) => {
        // Ensure images have exactly one primary
        const processedImages = data.images.map((img, index) => ({
            ...img,
            isPrimary: index === 0,
        }));

        const pet = await Pet.create({
            ...data,
            images: processedImages,
            owner: ownerId,
        });

        // Populate owner on the created document for the response
        return pet.populate('owner', 'name avatar.url location.city location.state');
    },

    /**
     * Update a pet listing.
     * Only the owner can update their own listings.
     * Status changes to 'adopted', 'sold', 'resolved' are allowed.
     *
     * @param {string} petId - Pet document ID
     * @param {string} ownerId - Authenticated user ID
     * @param {Object} data - Validated update data
     * @returns {Promise<Object>} Updated pet document
     * @throws {AppError} If not found, inactive, or not the owner
     */
    updatePet: async (petId, ownerId, data) => {
        const pet = await Pet.findById(petId);

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        if (!pet.isActive) {
            throw new AppError(
                'Cannot update a deleted listing.',
                410
            );
        }

        // Ownership check
        if (pet.owner.toString() !== ownerId.toString()) {
            throw new AppError(
                'You are not authorized to update this listing.',
                403
            );
        }

        // Prevent owner reassignment
        if (data.owner) {
            delete data.owner;
        }

        // Apply updates
        Object.keys(data).forEach((key) => {
            // Handle nested objects (location, age, healthStatus, contactInfo)
            if (
                typeof data[key] === 'object' &&
                !Array.isArray(data[key]) &&
                data[key] !== null &&
                pet[key] &&
                typeof pet[key] === 'object'
            ) {
                // Merge nested objects
                pet[key] = { ...pet[key].toObject?.() ?? pet[key], ...data[key] };
            } else {
                pet[key] = data[key];
            }
        });

        // Let Mongoose pre-save hooks handle primary image enforcement
        await pet.save({ validateModifiedOnly: true });

        return pet.populate(
            'owner',
            'name avatar.url location.city location.state'
        );
    },

    /**
     * Soft delete a pet listing (set isActive = false).
     * Only the owner can delete their own listings.
     *
     * @param {string} petId - Pet document ID
     * @param {string} ownerId - Authenticated user ID
     * @returns {Promise<void>}
     * @throws {AppError} If not found, already deleted, or not the owner
     */
    deletePet: async (petId, ownerId) => {
        const pet = await Pet.findById(petId);

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        if (!pet.isActive) {
            throw new AppError(
                'This listing has already been deleted.',
                410
            );
        }

        // Ownership check
        if (pet.owner.toString() !== ownerId.toString()) {
            throw new AppError(
                'You are not authorized to delete this listing.',
                403
            );
        }

        pet.isActive = false;
        pet.status = 'removed';
        await pet.save();
    },

    /**
     * Increment the view count for a pet listing.
     * Uses the static method on the Pet model for atomic $inc.
     *
     * @param {string} petId - Pet document ID
     * @returns {Promise<Object>} { viewCount: number }
     */
    incrementView: async (petId) => {
        const pet = await Pet.findById(petId).select('_id isActive');

        if (!pet) {
            throw new AppError('Pet listing not found.', 404);
        }

        if (!pet.isActive) {
            throw new AppError(
                'This pet listing is no longer available.',
                410
            );
        }

        const updated = await Pet.incrementView(petId);
        return { viewCount: updated.viewCount };
    },

    /**
     * Get featured (admin-promoted) pet listings.
     * Requires isFeatured: true, isActive: true, status: 'available'.
     *
     * @param {number} [limit=12] - Max results
     * @returns {Promise<Array>} Array of featured pet documents
     */
    getFeaturedPets: async (limit = 12) => {
        const pets = await Pet.getFeatured(limit).lean();
        return pets;
    },

    /**
     * Get search suggestions for autocomplete.
     * Returns up to 8 matching pet names/breeds with minimal fields.
     *
     * @param {string} query - Partial search text (min 2 chars)
     * @returns {Promise<Array>} Array of { _id, name, breed, species, primaryImage }
     */
    getSearchSuggestions: async (query) => {
        if (!query || query.trim().length < 2) {
            return [];
        }

        // Use regex for prefix matching (faster than text search for autocomplete)
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const suggestions = await Pet.find({
            isActive: true,
            $or: [
                { name: { $regex: `^${escapedQuery}`, $options: 'i' } },
                { breed: { $regex: `^${escapedQuery}`, $options: 'i' } },
                { tags: { $regex: `^${escapedQuery}`, $options: 'i' } },
            ],
        })
            .select('name breed species images')
            .limit(8)
            .lean();

        return suggestions.map((pet) => ({
            _id: pet._id,
            name: pet.name,
            breed: pet.breed,
            species: pet.species,
            primaryImage:
                pet.images && pet.images.length > 0
                    ? pet.images.find((img) => img.isPrimary) || pet.images[0]
                    : null,
        }));
    },

    /**
     * Get active pet counts grouped by species.
     * Used by the homepage category cards to show real numbers.
     */
    getSpeciesStats: async () => {
        const results = await Pet.aggregate([
            { $match: { isActive: true, status: 'available' } },
            { $group: { _id: '$species', count: { $sum: 1 } } },
        ]);

        // Convert array to { dog: 42, cat: 15, ... } map
        const map = {};
        results.forEach((r) => { if (r._id) map[r._id] = r.count; });
        return map;
    },
};

module.exports = petService;