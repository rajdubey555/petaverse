const express = require('express');
const reportController = require('./report.controller');
const auth = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const reportValidation = require('./report.validation');

const router = express.Router();

/**
 * Report Routes
 * Base path: /api/v1/reports
 *
 * All routes require authentication.
 * Users can file reports, view their own reports, and delete pending reports.
 *
 * Protected Routes:
 *   POST   /             — File a report against a pet listing
 *   GET    /my-reports   — Get current user's reports (paginated)
 *   DELETE /:id          — Delete own pending report
 *
 * ⚠️ Route Ordering Matters:
 *   - GET /my-reports is registered BEFORE DELETE /:id
 *   - This prevents Express from interpreting "my-reports" as an :id value
 */

// ── Auth Required on All Routes ──
router.use(auth);

// ── Report Routes ──

/**
 * POST /api/v1/reports
 * File a report against a pet listing.
 *
 * Body: { petId, reason, description? }
 *
 * Report reasons (matching Report model enum):
 *   spam, inappropriate_content, misleading_information,
 *   fraudulent_listing, already_adopted_sold, duplicate_listing,
 *   incorrect_species_breed, harmful_or_dangerous, other
 *
 * Security:
 *  - Pet must exist and be active
 *  - Cannot report own pet
 *  - Compound unique index prevents duplicate reports per user/pet
 *
 * Returns 201 for new report, 200 if already reported.
 */
router.post(
    '/',
    validate(reportValidation.createReport),
    reportController.createReport
);

/**
 * GET /api/v1/reports/my-reports
 * Get all reports filed by the current user.
 * Paginated. Each report includes populated pet details.
 *
 * Query params:
 *  - page (default: 1)
 *  - limit (default: 20, max: 50)
 *
 * Returns: { status: 'success', results: N, pagination: {...}, data: [...] }
 *
 * ⚠️ MUST be registered BEFORE /:id route below.
 */
router.get(
    '/my-reports',
    validate(reportValidation.queryMyReports, 'query'),
    reportController.getMyReports
);

/**
 * DELETE /api/v1/reports/:id
 * Withdraw a report filed by the current user.
 *
 * Constraints:
 *  - Only the original reporter can delete
 *  - Only pending reports can be deleted (not reviewed/resolved/dismissed)
 *
 * Returns: { status: 'success', message: '...', data: null }
 */
router.delete(
    '/:id',
    validate(reportValidation.reportIdParam, 'params'),
    reportController.deleteReport
);

module.exports = router;