const savedPetService = require('./savedPet.service');
const catchAsync = require('../../utils/catchAsync');
const { sendSuccess, sendListSuccess } = require('../../utils/responseHelper');

/**
 * SavedPet Controller
 * HTTP request/response handlers for saved-pets endpoints.
 *
 * All routes require authentication (mounted in routes with `auth` middleware).
 * The authenticated user's ID is read from req.user._id (set by auth middleware).
 */
const savedPetController = {
    /**
     * POST /api/v1/saved-pets
     * Toggle save/unsave a pet.
     *
     * Body: { petId: "..." }
     * If not saved → saves it and returns { saved: true }
     * If already saved → unsaves it and returns { saved: false }
     *
     * Validates pet existence and active status before toggling.
     */
    toggleSave: catchAsync(async (req, res) => {
        const { petId } = req.body;
        const userId = req.user._id;

        const result = await savedPetService.toggleSave(userId, petId);

        sendSuccess(res, {
            statusCode: 200,
            message: result.message,
            data: { saved: result.saved },
        });
    }),

    /**
     * DELETE /api/v1/saved-pets/:petId
     * Unsave a specific pet (direct delete, no toggle).
     * Returns 404 if the pet was never saved.
     */
    unsavePet: catchAsync(async (req, res) => {
        const { petId } = req.params;
        const userId = req.user._id;

        const result = await savedPetService.unsavePet(userId, petId);

        sendSuccess(res, {
            statusCode: 200,
            message: result.message,
            data: null,
        });
    }),

    /**
     * GET /api/v1/saved-pets/check/:petId
     * Check if a pet is saved by the current user.
     *
     * Returns: { saved: true | false }
     * This is a lightweight check — does NOT validate pet existence.
     * Used by the frontend to show filled/outlined heart icon on pet cards.
     */
    checkSaved: catchAsync(async (req, res) => {
        const { petId } = req.params;
        const userId = req.user._id;

        const result = await savedPetService.checkSaved(userId, petId);

        sendSuccess(res, {
            statusCode: 200,
            message: 'Save status retrieved successfully',
            data: result,
        });
    }),

    /**
     * GET /api/v1/saved-pets
     * Get paginated list of all saved pets for the current user.
     * Each item includes the full populated pet data with owner details.
     *
     * Query params: page (default 1), limit (default 12, max 50)
     * Inactive/deleted pets are filtered out via populate match.
     */
    getUserSavedPets: catchAsync(async (req, res) => {
        const userId = req.user._id;
        const { page, limit } = req.query;

        const { data, pagination } = await savedPetService.getUserSavedPets(
            userId,
            { page, limit }
        );

        sendListSuccess(res, {
            statusCode: 200,
            message: 'Saved pets retrieved successfully',
            data,
            pagination,
        });
    }),
};

module.exports = savedPetController;