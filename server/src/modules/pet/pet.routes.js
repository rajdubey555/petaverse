const express = require('express');
const petController = require('./pet.controller');
const { validate } = require('../../middleware/validate');
const petValidation = require('./pet.validation');
const auth = require('../../middleware/auth');

const router = express.Router();

/**
 * Pet Routes
 * Base path: /api/v1/pets
 *
 * Route Ordering Matters:
 *   GET /featured            — Must be before /:id
 *   GET /search/suggestions  — Must be before /:id
 *
 * Public Routes:
 *   GET  /                    — List pets (paginated, filtered, searchable)
 *   GET  /featured            — Featured/admin-promoted pets
 *   GET  /search/suggestions  — Autocomplete suggestions
 *   GET  /:id                 — Get single pet by ID
 *   POST /:id/view            — Increment view count
 *
 * Protected Routes (require valid access token):
 *   POST   /         — Create a new pet listing
 *   PATCH  /:id      — Update own pet listing
 *   DELETE /:id      — Soft delete own pet listing
 */

// ── Public Routes ──

/** List pets with pagination, filtering, sorting, and full-text search */
router.get(
    '/',
    validate(petValidation.queryPets, 'query'),
    petController.getPets
);

/** Get featured (admin-promoted) pet listings */
router.get('/featured', petController.getFeaturedPets);

/** Autocomplete search suggestions */
router.get('/search/suggestions', petController.getSearchSuggestions);

/** Get pet counts grouped by species for homepage category cards */
router.get('/stats/species', petController.getSpeciesStats);

/** Get a single pet listing by ID */
router.get('/:id', petController.getPetById);


/** Increment view count for a pet listing */
router.post('/:id/view', petController.incrementView);

// ── Protected Routes ──

/** Create a new pet listing — auth required, owner set from token */
router.post(
    '/',
    auth,
    validate(petValidation.createPet),
    petController.createPet
);

/** Update own pet listing — auth + ownership validation */
router.patch(
    '/:id',
    auth,
    validate(petValidation.updatePet),
    petController.updatePet
);

/** Soft delete own pet listing — auth + ownership validation */
router.delete('/:id', auth, petController.deletePet);

module.exports = router;