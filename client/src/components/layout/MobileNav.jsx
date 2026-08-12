import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiSearch,
    FiMapPin,
    FiHeart,
    FiUser,
    FiPlusCircle,
    FiLogIn,
    FiX,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import cn from '../../utils/cn';

const navItems = [
    { to: ROUTES.HOME, icon: FiHome, label: 'Home' },
    { to: ROUTES.BROWSE_PETS, icon: FiSearch, label: 'Browse' },
    { to: ROUTES.LOST_FOUND, icon: FiMapPin, label: 'Lost & Found' },
    { to: ROUTES.SAVED_PETS, icon: FiHeart, label: 'Saved', auth: true },
    { to: ROUTES.PROFILE, icon: FiUser, label: 'Profile', auth: true },
];

const MobileNav = ({ isOpen, onClose, isAuthenticated, user }) => {
    const mobileLinkClasses = ({ isActive }) =>
        cn(
            'flex flex-col items-center gap-1 px-3 py-2 text-[11px] font-medium rounded-xl transition-colors duration-200',
            isActive
                ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        );

    const drawerLinkClasses = ({ isActive }) =>
        cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
            isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        );

    return (
        <>
            {/* Bottom Navigation Bar (mobile) */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-bottom"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-around px-1 py-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        if (item.auth && !isAuthenticated) return null;

                        return (
                            <NavLink key={item.to} to={item.to} className={mobileLinkClasses}>
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Side Drawer (mobile hamburger) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Drawer Panel */}
                        <motion.aside
                            className="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                <Link
                                    to={ROUTES.HOME}
                                    onClick={onClose}
                                    className="flex items-center gap-2.5"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-base">🐾</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        Pet<span className="text-primary-500">Verse</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                {[
                                    { to: ROUTES.HOME, icon: FiHome, label: 'Home' },
                                    { to: ROUTES.BROWSE_PETS, icon: FiSearch, label: 'Browse Pets' },
                                    { to: ROUTES.LOST_FOUND, icon: FiMapPin, label: 'Lost & Found' },
                                ].map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            onClick={onClose}
                                            className={drawerLinkClasses}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.label}
                                        </NavLink>
                                    );
                                })}

                                <hr className="my-3 border-gray-200 dark:border-gray-800" />

                                {isAuthenticated ? (
                                    <>
                                        {[
                                            { to: ROUTES.CREATE_LISTING, icon: FiPlusCircle, label: 'Add Listing' },
                                            { to: ROUTES.SAVED_PETS, icon: FiHeart, label: 'Saved Pets' },
                                            { to: ROUTES.PROFILE, icon: FiUser, label: 'My Profile' },
                                            { to: ROUTES.MY_LISTINGS, icon: FiSearch, label: 'My Listings' },
                                        ].map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={onClose}
                                                    className={drawerLinkClasses}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {link.label}
                                                </NavLink>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <NavLink
                                        to={ROUTES.LOGIN}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors text-sm"
                                    >
                                        <FiLogIn className="w-5 h-5" />
                                        Sign In / Register
                                    </NavLink>
                                )}

                                <hr className="my-3 border-gray-200 dark:border-gray-800" />

                                {[
                                    { to: ROUTES.ABOUT, label: 'About Us' },
                                    { to: ROUTES.CONTACT, label: 'Contact Us' },
                                    { to: ROUTES.PRIVACY, label: 'Privacy Policy' },
                                    { to: ROUTES.TERMS, label: 'Terms & Conditions' },
                                ].map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Drawer Footer */}
                            {isAuthenticated && user && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileNav;