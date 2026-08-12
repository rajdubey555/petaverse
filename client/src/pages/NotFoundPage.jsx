import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch } from 'react-icons/fi';
import { ROUTES } from '../config/routes';
import SEO from '../components/common/SEO';

/**
 * NotFoundPage — 404 page shown when no route matches.
 *
 * Includes:
 * - Animated 404 illustration
 * - Friendly message
 * - CTA buttons: Go Home / Browse Pets
 */
const NotFoundPage = () => {
    return (
        <>
            <SEO title="Page Not Found" noindex />

            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
                <motion.div
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 404 Illustration */}
                    <motion.div
                        className="mb-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="relative inline-flex">
                            <span className="text-[120px] font-extrabold leading-none bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent select-none">
                                404
                            </span>
                            <motion.span
                                className="absolute -top-2 -right-4 text-4xl"
                                animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🐾
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* Message */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Oops! Page not found
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track!
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to={ROUTES.HOME}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                        >
                            <FiHome className="w-4 h-4" />
                            Go Home
                        </Link>
                        <Link
                            to={ROUTES.BROWSE_PETS}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors w-full sm:w-auto justify-center"
                        >
                            <FiSearch className="w-4 h-4" />
                            Browse Pets
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default NotFoundPage;