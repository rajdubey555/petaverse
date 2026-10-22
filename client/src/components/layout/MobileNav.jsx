import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
    FiHome,
    FiSearch,
    FiMapPin,
    FiHeart,
    FiUser,
    FiPlusCircle,
    FiLogIn,
    FiLogOut,
    FiX,
    FiCamera,
    FiUsers,
    FiShield,
    FiSettings,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { useLogoutMutation } from '../../store/api/authApi';
import cn from '../../utils/cn';

const MobileNav = ({ isOpen, onClose, isAuthenticated, user }) => {
    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch {
            // ignore
        }
        onClose();
    };

    // 5 Clean Bottom Bar Items for Mobile
    const bottomNavItems = [
        { to: ROUTES.HOME, icon: FiHome, label: 'Home' },
        { to: ROUTES.BROWSE_PETS, icon: FiSearch, label: 'Browse' },
        { to: ROUTES.SCANNER, icon: FiCamera, label: 'Scanner', isSpecial: true },
        { to: ROUTES.LOST_FOUND, icon: FiMapPin, label: 'Lost & Found' },
        isAuthenticated
            ? { to: ROUTES.PROFILE(user?._id || user?.id), icon: FiUser, label: 'Profile' }
            : { to: ROUTES.LOGIN, icon: FiLogIn, label: 'Sign In' },
    ];

    const mobileLinkClasses = ({ isActive }) =>
        cn(
            'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-[10px] font-semibold rounded-xl transition-all duration-200 select-none flex-1',
            isActive
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
        );

    const drawerLinkClasses = ({ isActive }) =>
        cn(
            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            isActive
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        );

    return (
        <>
            {/* Bottom Navigation Bar (Phone only: below md screen) */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800 safe-area-bottom shadow-lg"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-between px-2 py-1 max-w-md mx-auto">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink key={item.to} to={item.to} end={item.to === ROUTES.HOME} className={mobileLinkClasses}>
                                {item.isSpecial ? (
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 -mt-2">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                                <span className={item.isSpecial ? 'mt-0.5 font-bold text-amber-600 dark:text-amber-400' : ''}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Side Drawer (Visible below lg screens for mobile + tablets) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Drawer Panel */}
                        <motion.aside
                            className="fixed top-0 left-0 z-50 h-full w-[82vw] max-w-xs sm:w-80 bg-white dark:bg-neutral-900 shadow-2xl lg:hidden flex flex-col border-r border-neutral-200 dark:border-neutral-800"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50">
                                <Link
                                    to={ROUTES.HOME}
                                    onClick={onClose}
                                    className="flex items-center gap-2.5"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/30">
                                        <FiHeart className="w-5 h-5 text-white fill-white" />
                                    </div>
                                    <span className="text-xl font-black text-neutral-900 dark:text-white">
                                        Pet<span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Verse</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Links Scroll Area */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                                <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                    Navigation
                                </p>
                                {[
                                    { to: ROUTES.HOME, icon: FiHome, label: 'Home' },
                                    { to: ROUTES.BROWSE_PETS, icon: FiSearch, label: 'Browse Pets' },
                                    { to: ROUTES.SCANNER, icon: FiCamera, label: 'Smart Scanner [QR & AI]', isSpecial: true },
                                    { to: ROUTES.LOST_FOUND, icon: FiMapPin, label: 'Lost & Found' },
                                    { to: ROUTES.COMMUNITY, icon: FiUsers, label: 'Community Hub' },
                                ].map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            end={link.to === ROUTES.HOME}
                                            onClick={onClose}
                                            className={drawerLinkClasses}
                                        >
                                            <Icon className={`w-5 h-5 ${link.isSpecial ? 'text-amber-500' : ''}`} />
                                            <span className="flex-1">{link.label}</span>
                                            {link.isSpecial && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-white">
                                                    AI
                                                </span>
                                            )}
                                        </NavLink>
                                    );
                                })}

                                <hr className="my-2 border-neutral-200 dark:border-neutral-800" />

                                {isAuthenticated ? (
                                    <>
                                        <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                            My Account
                                        </p>
                                        <NavLink
                                            to={ROUTES.CREATE_LISTING}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md shadow-amber-500/20"
                                        >
                                            <FiPlusCircle className="w-5 h-5" />
                                            <span>Post a Pet Listing</span>
                                        </NavLink>

                                        {[
                                            { to: ROUTES.SAVED_PETS, icon: FiHeart, label: 'Saved Wishlist' },
                                            { to: ROUTES.MY_LISTINGS, icon: FiSearch, label: 'My Pet Listings' },
                                            { to: ROUTES.PROFILE(user?._id || user?.id), icon: FiUser, label: 'My Profile' },
                                            { to: ROUTES.SETTINGS, icon: FiSettings, label: 'Account Settings' },
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

                                        {user?.role === 'admin' && (
                                            <NavLink
                                                to={ROUTES.ADMIN.DASHBOARD}
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-sm"
                                            >
                                                <FiShield className="w-5 h-5" />
                                                Admin Dashboard
                                            </NavLink>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="pt-2 space-y-2">
                                        <NavLink
                                            to={ROUTES.LOGIN}
                                            onClick={onClose}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md shadow-amber-500/20"
                                        >
                                            <FiLogIn className="w-5 h-5" />
                                            Sign In to PetVerse
                                        </NavLink>
                                        <NavLink
                                            to={ROUTES.REGISTER}
                                            onClick={onClose}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            Create Free Account
                                        </NavLink>
                                    </div>
                                )}

                                <hr className="my-2 border-neutral-200 dark:border-neutral-800" />

                                <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                    Information
                                </p>
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
                                        className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Drawer User Info Footer */}
                            {isAuthenticated && user && (
                                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden">
                                            {user.avatar?.url ? (
                                                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name?.charAt(0)?.toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
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