const Joi = require('joi');

/**
 * Report Validation Schemas
 * Validates request bodies, params, and query params for report endpoints.
 *
 * Reason values must match the Report model's enum:
 * spam, inappropriate_content, misleading_information, fraudulent_listing,
 * already_adopted_sold, duplicate_listing, incorrect_species_breed,
 * harmful_or_dangerous, other
 */
const reportValidation = {
    /**
     * Create a report against a pet listing.
     * POST /api/v1/reports
     */
    createReport: Joi.object({
        petId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .allow('', null),
        reportedUserId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .allow('', null),
        reason: Joi.string()
            .valid(
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
                'other'
            )
            .required()
            .messages({
                'any.only': 'Please select a valid report reason.',
                'any.required': 'Report reason is required.',
            }),
        description: Joi.string()
            .max(1000)
            .allow('')
            .default('')
            .messages({
                'string.max': 'Report description cannot exceed 1000 characters.',
            }),
    }).or('petId', 'reportedUserId'),

    /**
     * Query parameters for listing user's reports.
     * GET /api/v1/reports/my-reports
     */
    queryMyReports: Joi.object({
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
            .default(20)
            .messages({
                'number.base': 'Limit must be a number',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 50',
            }),
    }),

    /**
     * Route parameter: report ID (ObjectId format validation).
     * Used by DELETE /:id
     */
    reportIdParam: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid report ID format. Must be a 24-character hex string.',
            }),
    }),
};

module.exports = reportValidation;