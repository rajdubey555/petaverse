/**
 * Async Error Wrapper
 * Eliminates try/catch blocks in async route handlers and controllers.
 * Any rejected promise or thrown error is forwarded to Express error handler.
 *
 * Usage:
 *   router.get('/pets', catchAsync(petController.getPets));
 *
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;