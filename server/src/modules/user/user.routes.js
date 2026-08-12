const express = require('express');
const Joi = require('joi');
const userController = require('./user.controller');
const auth = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const userValidation = require('./user.validation');

const router = express.Router();

/**
 * User Routes
 *
 * Route ordering is CRITICAL:
 * - Static paths (/profile, /account) MUST be defined BEFORE
 *   parameterized paths (/:id, /:id/listings) to prevent Express
 *   from matching "profile" or "account" as an :id parameter.
 *
 * Public Routes:
 * - GET /:id          — View any user's public profile
 * - GET /:id/listings — View any user's active pet listings
 *
 * Protected Routes (require authentication):
 * - PATCH /profile   — Update own profile
 * - DELETE /account  — Soft delete own account
 */

// ── User Listings Query Validation (prevents NoSQL injection) ──
const userListingsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12),
    sort: Joi.string().max(50),
    fields: Joi.string().max(200),
    listingType: Joi.string().valid('adoption', 'rehoming', 'lost', 'found', 'sale'),
    species: Joi.string().valid('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'),
}).unknown(false);

// ── Protected: Update own profile ──
router.patch(
    '/profile',
    auth,
    validate(userValidation.updateProfile),
    userController.updateProfile
);

// ── Protected: Delete own account ──
router.delete(
    '/account',
    auth,
    userController.deleteAccount
);

// ── Public: Get user's active listings ──
router.get(
    '/:id/listings',
    validate(userListingsQuerySchema, 'query'),
    userController.getUserListings
);

// ── Protected: Rate user profile ──
router.post(
    '/:id/rate',
    auth,
    userController.rateUser
);

// ── Public: Get user profile ──
router.get(
    '/:id',
    userController.getPublicProfile
);

module.exports = router;