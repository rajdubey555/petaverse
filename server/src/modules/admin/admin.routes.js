const express = require('express');
const Joi = require('joi');
const adminController = require('./admin.controller');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { validate } = require('../../middleware/validate');

const router = express.Router();

/**
 * Admin Routes
 * Base path: /api/v1/admin
 *
 * Route Ordering:
 * - Static paths (/dashboard, /users, /pets, /reports) are defined BEFORE
 *   parameterized paths (/:id/status, /:id/feature, /:id) to prevent
 *   Express from matching "dashboard" or "users" as an :id parameter.
 *
 * All routes require:
 *   - auth middleware (valid JWT access token)
 *   - admin middleware (role === 'admin')
 *
 * Public: None — admin access only
 *
 * Endpoints:
 *   GET    /dashboard        — Dashboard statistics
 *   GET    /users             — List all users (paginated)
 *   GET    /pets              — List all pets (paginated)
 *   GET    /reports           — List all reports (paginated, filterable by status)
 *   PATCH  /users/:id/status  — Toggle user active status
 *   PATCH  /pets/:id/feature  — Toggle pet featured status
 *   DELETE /pets/:id          — Soft delete pet listing (admin override)
 */

// ── Admin Query Validation (prevents NoSQL injection) ──
const adminQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().max(50),
    fields: Joi.string().max(200),
    search: Joi.string().max(100),
    // Whitelisted filter fields — all others rejected
    isActive: Joi.boolean(),
    role: Joi.string().valid('user', 'admin'),
    status: Joi.string().valid('pending', 'reviewed', 'resolved', 'dismissed'),
    listingType: Joi.string().valid('adoption', 'rehoming', 'lost', 'found', 'sale'),
    species: Joi.string().valid('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'),
    isFeatured: Joi.boolean(),
    isVerified: Joi.boolean(),
}).unknown(false);

// ── Apply auth + admin to ALL admin routes ──
router.use(auth, admin);

// ── Dashboard ──
router.get('/dashboard', adminController.getDashboard);

// ── User Management ──
router.get('/users', validate(adminQuerySchema, 'query'), adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);

// ── Pet Management ──
router.get('/pets', validate(adminQuerySchema, 'query'), adminController.getPets);
router.patch('/pets/:id/feature', adminController.togglePetFeature);
router.delete('/pets/:id', adminController.deletePet);

// ── Report Management ──
router.get('/reports', validate(adminQuerySchema, 'query'), adminController.getReports);
router.patch('/reports/:id/status', adminController.updateReportStatus);

module.exports = router;