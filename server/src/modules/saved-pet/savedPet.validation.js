const Joi = require('joi');

/**
 * SavedPet Validation Schemas
 * Validates request bodies, params, and query params for saved-pets endpoints.
 */
const savedPetValidation = {
    /**
     * Toggle save/unsave a pet.
     * POST /api/v1/saved-pets
     */
    toggleSave: Joi.object({
        petId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid pet ID format. Must be a 24-character hex string.',
                'any.required': 'Pet ID is required to save/unsave.',
            }),
    }),

    /**
     * Query parameters for listing saved pets.
     * GET /api/v1/saved-pets
     */
    querySavedPets: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.min': 'Page must be at least 1',
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(50)
            .default(12)
            .messages({
                'number.base': 'Limit must be a number',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 50',
            }),
    }),

    /**
     * Route parameter: petId (ObjectId format validation).
     * Used by DELETE /:petId and GET /check/:petId
     */
    petIdParam: Joi.object({
        petId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid pet ID format in URL. Must be a 24-character hex string.',
            }),
    }),
};

module.exports = savedPetValidation;