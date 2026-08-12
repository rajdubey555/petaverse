const AppError = require('../utils/AppError');

/**
 * Validation Middleware Factory
 * Creates Express middleware that validates req.body (or specified property)
 * against a Joi schema.
 *
 * Usage:
 *   const { createPetSchema } = require('../modules/pet/pet.validation');
 *   router.post('/pets', validate(createPetSchema), petController.createPet);
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} [property='body'] - Request property to validate (body, query, params)
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const data = req[property];

        if (!schema) {
            throw new Error('Validation schema is required');
        }

        const { error, value } = schema.validate(data, {
            abortEarly: false,       // Return all errors, not just the first
            stripUnknown: true,      // Remove unknown fields
            allowUnknown: false,     // Reject unknown fields
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, ''),
            }));

            const message = errors.length === 1
                ? errors[0].message
                : `Validation failed: ${errors.map((e) => e.message).join('; ')}`;

            throw new AppError(message, 400);
        }

        // Replace req data with validated (and sanitized) values
        req[property] = value;
        next();
    };
};

module.exports = { validate };