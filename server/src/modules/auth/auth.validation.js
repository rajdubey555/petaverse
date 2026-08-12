const Joi = require('joi');

/**
 * Auth Validation Schemas
 * Validates request bodies for auth routes.
 */
const authValidation = {
    /**
     * Google OAuth login validation.
     */
    googleLogin: Joi.object({
        credential: Joi.string()
            .required()
            .messages({
                'string.empty': 'Google credential token is required',
                'any.required': 'Google credential token is required',
            }),
    }),

    /**
     * Email/Password registration validation.
     */
    register: Joi.object({
        name: Joi.string().trim().min(2).max(100).required().messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
        }),
        password: Joi.string().min(6).max(128).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
        phone: Joi.string().trim().min(6).max(20).required().messages({
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required',
            'string.min': 'Please enter a valid phone number',
        }),
        location: Joi.object({
            city: Joi.string().trim().min(2).max(100).required().messages({
                'string.empty': 'City is required',
                'any.required': 'City is required',
            }),
            state: Joi.string().trim().allow('').default(''),
            country: Joi.string().trim().allow('').default('India'),
        }).required(),

    }),

    /**
     * Email/Password login validation.
     */
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
        }),
    }),

    /**
     * Token refresh validation.
     */
    refreshToken: Joi.object({}),
};

module.exports = authValidation;