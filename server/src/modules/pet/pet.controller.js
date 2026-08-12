const petService = require('./pet.service');
const catchAsync = require('../../utils/catchAsync');
const {
    sendSuccess,
    sendCreated,
    sendNoContent,
    sendListSuccess,
} = require('../../utils/responseHelper');

/**
 * Pet Controller
 * HTTP request/response handler for pet listing routes.
 * Delegates business logic to petService.
 */
const petController = {
    /**
     * GET /api/v1/pets
     * List pets with pagination, filtering, sorting, and search.
     * Public route — no authentication required.
     */
    getPets: catchAsync(async (req, res) => {
        const { data, pagination } = await petService.getPets(req.query);

        sendListSuccess(res, {
            message: 'Pet listings retrieved successfully',
            data,
            pagination,
        });
    }),

    /**
     * GET /api/v1/pets/featured
     * Get featured (admin-promoted) pet listings.
     * Must be defined BEFORE /:id to avoid route conflict.
     * Public route.
     */
    getFeaturedPets: catchAsync(async (req, res) => {
        const limit = Math.min(
            Math.max(1, parseInt(req.query.limit, 10)) || 12,
            24
        );

        const pets = await petService.getFeaturedPets(limit);

        sendSuccess(res, {
            message: 'Featured pets retrieved successfully',
            data: pets,
        });
    }),

    /**
     * GET /api/v1/pets/search/suggestions
     * Autocomplete search suggestions for pet names/breeds.
     * Public route.
     */
    getSearchSuggestions: catchAsync(async (req, res) => {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return sendSuccess(res, {
                message: 'Search suggestions',
                data: [],
            });
        }

        const suggestions = await petService.getSearchSuggestions(q);

        sendSuccess(res, {
            message: 'Search suggestions retrieved',
            data: suggestions,
        });
    }),

    /**
     * GET /api/v1/pets/:id
     * Get a single pet listing by ID with owner details populated.
     * Public route.
     */
    getPetById: catchAsync(async (req, res) => {
        const pet = await petService.getPetById(req.params.id);

        sendSuccess(res, {
            message: 'Pet listing retrieved successfully',
            data: pet,
        });
    }),

    /**
     * POST /api/v1/pets
     * Create a new pet listing.
     * Requires authentication. Owner is set from req.user.
     */
    createPet: catchAsync(async (req, res) => {
        const pet = await petService.createPet(req.body, req.user._id);

        sendCreated(res, {
            message: 'Pet listing created successfully',
            data: pet,
        });
    }),

    /**
     * PATCH /api/v1/pets/:id
     * Update an existing pet listing.
     * Requires authentication AND ownership.
     */
    updatePet: catchAsync(async (req, res) => {
        const pet = await petService.updatePet(
            req.params.id,
            req.user._id,
            req.body
        );

        sendSuccess(res, {
            message: 'Pet listing updated successfully',
            data: pet,
        });
    }),

    /**
     * DELETE /api/v1/pets/:id
     * Soft delete a pet listing (isActive = false, status = 'removed').
     * Requires authentication AND ownership.
     */
    deletePet: catchAsync(async (req, res) => {
        await petService.deletePet(req.params.id, req.user._id);

        sendNoContent(res);
    }),

    /**
     * POST /api/v1/pets/:id/view
     * Increment the view count for a pet listing.
     * Public route — does not require authentication.
     */
    incrementView: catchAsync(async (req, res) => {
        const result = await petService.incrementView(req.params.id);

        sendSuccess(res, {
            message: 'View count updated',
            data: result,
        });
    }),

    /**
     * GET /api/v1/pets/stats/species
     * Get pet count per species (active, available pets only).
     * Public route — used by homepage category section.
     */
    getSpeciesStats: catchAsync(async (req, res) => {
        const result = await petService.getSpeciesStats();
        sendSuccess(res, { message: 'Species stats retrieved', data: result });
    }),
};

module.exports = petController;