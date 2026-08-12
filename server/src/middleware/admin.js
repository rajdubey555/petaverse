const AppError = require('../utils/AppError');

/**
 * Admin Authorization Middleware
 * Must be used AFTER auth middleware (requires req.user).
 * Checks that the authenticated user has the 'admin' role.
 *
 * Usage:
 *   router.get('/admin/stats', auth, admin, adminController.getStats);
 */
const admin = (req, res, next) => {
    if (!req.user) {
        throw new AppError(
            'Authentication required. Use auth middleware before admin middleware.',
            401
        );
    }

    if (req.user.role !== 'admin') {
        throw new AppError(
            'Access denied. Admin privileges required.',
            403
        );
    }

    next();
};

module.exports = admin;