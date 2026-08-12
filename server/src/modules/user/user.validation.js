const Joi = require('joi');

/**
 * User Validation Schemas
 * Validates request bodies for user profile operations.
 */
const userValidation = {
    /**
     * Update own profile.
     */
    updateProfile: Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Name must be at least 2 characters',
                'string.max': 'Name cannot exceed 100 characters',
            }),
        bio: Joi.string()
            .max(500)
            .allow('')
            .messages({
                'string.max': 'Bio cannot exceed 500 characters',
            }),
        phone: Joi.string()
            .pattern(/^[+]?[\d\s()-]{7,15}$/)
            .allow('')
            .messages({
                'string.pattern.base': 'Please provide a valid phone number',
            }),
        avatar: Joi.object({
            url: Joi.string().uri().allow(''),
            publicId: Joi.string().allow(''),
        }),
        location: Joi.object({
            city: Joi.string().trim().max(100).allow(''),
            state: Joi.string().trim().max(100).allow(''),
            country: Joi.string().trim().max(100).allow(''),
        }),
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update',
    }),
};

module.exports = userValidation;