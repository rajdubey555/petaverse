const express = require('express');
const savedPetController = require('./savedPet.controller');
const auth = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const savedPetValidation = require('./savedPet.validation');

const router = express.Router();

/**
 * SavedPet Routes
 * Base path: /api/v1/saved-pets
 *
 * All routes require authentication.
 * Users can only manage their own saved pets.
 *
 * Protected Routes:
 *   GET    /                 — List all saved pets (paginated, with pet details)
 *   POST   /                 — Toggle save/unsave a pet
 *   GET    /check/:petId     — Check if a specific pet is saved
 *   DELETE /:petId           — Unsave a specific pet
 *
 * ⚠️ Route Ordering Matters:
 *   - /check/:petId is registered BEFORE /:petId
 *   - This prevents Express from interpreting "check" as a :petId value
 */

// ── Auth Required on All Routes ──
router.use(auth);

// ── SavedPet Routes ──

/**
 * POST /api/v1/saved-pets
 * Toggle save/unsave a pet.
 *
 * Body: { petId: "60d5f484f1a2c8b1f8e4e1a1" }
 *
 * If the pet is not saved → creates a SavedPet document (saved: true).
 * If the pet is already saved → deletes the SavedPet document (saved: false).
 *
 * Validates:
 *  - petId is a valid MongoDB ObjectId
 *  - Pet exists and is active
 *
 * Returns: { status: 'success', message: '...', data: { saved: true|false } }
 */
router.post(
    '/',
    validate(savedPetValidation.toggleSave),
    savedPetController.toggleSave
);

/**
 * GET /api/v1/saved-pets
 * Get all saved pets for the authenticated user.
 * Paginated. Each item includes the full pet data with owner details.
 *
 * Query params:
 *  - page (default: 1)
 *  - limit (default: 12, max: 50)
 *
 * Returns: { status: 'success', message: '...', results: N, pagination: {...}, data: [...] }
 */
router.get(
    '/',
    validate(savedPetValidation.querySavedPets, 'query'),
    savedPetController.getUserSavedPets
);

/**
 * GET /api/v1/saved-pets/check/:petId
 * Check if a specific pet is saved by the current user.
 * Lightweight check — returns boolean, does NOT validate pet existence.
 *
 * Use case: Frontend calls this to determine if the heart icon
 * should be filled or outlined when rendering pet cards.
 *
 * Returns: { status: 'success', data: { saved: true|false } }
 *
 * ⚠️ MUST be registered BEFORE /:petId route below.
 */
router.get(
    '/check/:petId',
    validate(savedPetValidation.petIdParam, 'params'),
    savedPetController.checkSaved
);

/**
 * DELETE /api/v1/saved-pets/:petId
 * Unsave a specific pet. Direct delete — no toggle.
 * Returns 404 if the pet is not currently saved.
 *
 * Returns: { status: 'success', message: '...', data: null }
 */
router.delete(
    '/:petId',
    validate(savedPetValidation.petIdParam, 'params'),
    savedPetController.unsavePet
);

module.exports = router;