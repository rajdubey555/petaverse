const Joi = require('joi');
const {
    LISTING_TYPES,
    SPECIES,
    GENDERS,
    SIZES,
    AGE_UNITS,
    CONTACT_METHODS,
    LISTING_STATUSES,
} = require('../../utils/constants');

/**
 * Pet Validation Schemas
 * Validates request bodies for pet listing CRUD operations.
 */
const petValidation = {
    /**
     * Create a new pet listing.
     */
    createPet: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Pet name is required',
                'string.max': 'Name cannot exceed 100 characters',
                'any.required': 'Pet name is required',
            }),

        species: Joi.string()
            .valid(...SPECIES)
            .required()
            .messages({
                'any.only': `Species must be one of: ${SPECIES.join(', ')}`,
                'any.required': 'Species is required',
            }),

        breed: Joi.string()
            .trim()
            .max(100)
            .allow('')
            .default(''),

        age: Joi.object({
            value: Joi.number()
                .min(0)
                .required()
                .messages({
                    'number.min': 'Age cannot be negative',
                    'any.required': 'Age value is required',
                }),
            unit: Joi.string()
                .valid(...AGE_UNITS)
                .required()
                .messages({
                    'any.only': `Age unit must be one of: ${AGE_UNITS.join(', ')}`,
                    'any.required': 'Age unit is required',
                }),
        }).required().messages({
            'any.required': 'Age is required',
        }),

        gender: Joi.string()
            .valid(...GENDERS)
            .default('unknown'),

        size: Joi.string()
            .valid(...SIZES)
            .default('medium'),

        color: Joi.string()
            .trim()
            .max(50)
            .allow('')
            .default(''),

        description: Joi.string()
            .max(2000)
            .allow('')
            .default(''),

        healthStatus: Joi.object({
            vaccinated: Joi.boolean().default(false),
            neutered: Joi.boolean().default(false),
            microchipped: Joi.boolean().default(false),
            notes: Joi.string().max(500).allow('').default(''),
        }).default({
            vaccinated: false,
            neutered: false,
            microchipped: false,
            notes: '',
        }),

        listingType: Joi.string()
            .valid(...LISTING_TYPES)
            .required()
            .messages({
                'any.only': `Listing type must be one of: ${LISTING_TYPES.join(', ')}`,
                'any.required': 'Listing type is required',
            }),

        price: Joi.number()
            .min(0)
            .default(0)
            .when('listingType', {
                is: 'sale',
                then: Joi.number().min(1).required().messages({
                    'number.min': 'Price is required for sale listings and must be greater than 0',
                    'any.required': 'Price is required for sale listings',
                }),
            }),

        isNegotiable: Joi.boolean().default(true),

        location: Joi.object({
            city: Joi.string()
                .trim()
                .required()
                .messages({
                    'string.empty': 'City is required',
                    'any.required': 'City is required',
                }),
            state: Joi.string().trim().allow('').default(''),
            country: Joi.string().trim().allow('').default(''),
        }).required().messages({
            'any.required': 'Location is required',
        }),

        images: Joi.array()
            .items(
                Joi.object({
                    url: Joi.string().uri().required().messages({
                        'string.uri': 'Each image must have a valid URL',
                        'any.required': 'Image URL is required',
                    }),
                    publicId: Joi.string().required().messages({
                        'any.required': 'Image publicId is required',
                    }),
                    isPrimary: Joi.boolean().default(false),
                })
            )
            .min(1)
            .max(5)
            .required()
            .messages({
                'array.min': 'At least 1 image is required',
                'array.max': 'Maximum 5 images allowed',
                'any.required': 'At least 1 image is required',
            }),

        tags: Joi.array()
            .items(Joi.string().trim().max(30))
            .max(10)
            .default([]),

        contactInfo: Joi.object({
            phone: Joi.string().allow('').default(''),
            email: Joi.string().email().allow('').default(''),
            preferredMethod: Joi.string()
                .valid(...CONTACT_METHODS)
                .default('platform'),
        }).default({
            phone: '',
            email: '',
            preferredMethod: 'platform',
        }),
    }),

    /**
     * Update an existing pet listing.
     * All fields optional — only provided fields are updated.
     */
    updatePet: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .messages({
                'string.empty': 'Pet name cannot be empty',
                'string.max': 'Name cannot exceed 100 characters',
            }),

        species: Joi.string()
            .valid(...SPECIES)
            .messages({
                'any.only': `Species must be one of: ${SPECIES.join(', ')}`,
            }),

        breed: Joi.string().trim().max(100).allow(''),

        age: Joi.object({
            value: Joi.number().min(0).messages({
                'number.min': 'Age cannot be negative',
            }),
            unit: Joi.string().valid(...AGE_UNITS).messages({
                'any.only': `Age unit must be one of: ${AGE_UNITS.join(', ')}`,
            }),
        }),

        gender: Joi.string().valid(...GENDERS),

        size: Joi.string().valid(...SIZES),

        color: Joi.string().trim().max(50).allow(''),

        description: Joi.string().max(2000).allow(''),

        healthStatus: Joi.object({
            vaccinated: Joi.boolean(),
            neutered: Joi.boolean(),
            microchipped: Joi.boolean(),
            notes: Joi.string().max(500).allow(''),
        }),

        listingType: Joi.string()
            .valid(...LISTING_TYPES)
            .messages({
                'any.only': `Listing type must be one of: ${LISTING_TYPES.join(', ')}`,
            }),

        status: Joi.string()
            .valid(...LISTING_STATUSES)
            .messages({
                'any.only': `Status must be one of: ${LISTING_STATUSES.join(', ')}`,
            }),

        price: Joi.number()
            .min(0)
            .when('listingType', {
                is: 'sale',
                then: Joi.number().min(1).messages({
                    'number.min': 'Price is required for sale listings and must be greater than 0',
                }),
            }),

        isNegotiable: Joi.boolean(),

        location: Joi.object({
            city: Joi.string().trim(),
            state: Joi.string().trim().allow(''),
            country: Joi.string().trim().allow(''),
        }),

        images: Joi.array()
            .items(
                Joi.object({
                    url: Joi.string().uri().required(),
                    publicId: Joi.string().required(),
                    isPrimary: Joi.boolean().default(false),
                })
            )
            .min(1)
            .max(5)
            .messages({
                'array.min': 'At least 1 image is required',
                'array.max': 'Maximum 5 images allowed',
            }),

        tags: Joi.array()
            .items(Joi.string().trim().max(30))
            .max(10),

        contactInfo: Joi.object({
            phone: Joi.string().allow(''),
            email: Joi.string().email().allow(''),
            preferredMethod: Joi.string().valid(...CONTACT_METHODS),
        }),
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update',
    }),

    /**
     * Increment view count.
     */
    viewPet: Joi.object({}),

    /**
     * Query string validation for pet listing queries.
     */
    queryPets: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(12),
        sort: Joi.string().default('-createdAt'),
        fields: Joi.string(),
        search: Joi.string().max(200),
        species: Joi.string().allow('', null),
        breed: Joi.string().max(100).allow('', null),
        listingType: Joi.string().allow('', null),
        status: Joi.string().valid(...LISTING_STATUSES).allow('', null),
        gender: Joi.string().allow('', null),
        size: Joi.string().allow('', null),
        ageMin: Joi.number().min(0),
        ageMax: Joi.number().min(0),
        city: Joi.string().max(100).allow('', null),
        state: Joi.string().max(100).allow('', null),
        priceMin: Joi.number().min(0),
        priceMax: Joi.number().min(0),
        vaccinated: Joi.boolean().allow('', null),
        neutered: Joi.boolean().allow('', null),
        isFeatured: Joi.boolean().allow('', null),
        isVerified: Joi.boolean().allow('', null),
        owner: Joi.string().allow('', null),
        populate: Joi.string().allow('', null),
    }),

    /**
     * Report a pet listing.
     */
    reportPet: Joi.object({
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
                'other'
            )
            .required()
            .messages({
                'any.only': 'Please select a valid report reason',
                'any.required': 'Report reason is required',
            }),
        description: Joi.string()
            .max(1000)
            .allow('')
            .default(''),
    }),
};

module.exports = petValidation;