import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiHeart,
  FiPlus,
  FiUser,
  FiSearch,
  FiAlertCircle,
  FiGlobe,
  FiMessageCircle,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { toggleMobileMenu } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import cn from '../../utils/cn';

const publicNavLinks = [
  { to: ROUTES.HOME, label: 'Home', icon: '🏠' },
  { to: ROUTES.BROWSE_PETS, label: 'Browse Pets', icon: '🐶' },
  { to: ROUTES.LOST_FOUND, label: 'Lost & Found', icon: '🚨', isAlert: true },
  { to: ROUTES.COMMUNITY, label: 'Community', icon: '💬' },
  { to: ROUTES.ABOUT, label: 'About Us', icon: '🐾' },
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const hoverTimeout = useRef(null);

  const openMenu  = () => { clearTimeout(hoverTimeout.current); setUserMenuOpen(true); };
  const closeMenu = () => { hoverTimeout.current = setTimeout(() => setUserMenuOpen(false), 150); };

  // Track scroll for header backdrop blur & shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseMobileMenu = () => {
    dispatch(toggleMobileMenu());
  };

  return (
    <>
      {/* Top playful accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full" />

      <header
        className={cn(
          'sticky top-0 z-40 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md transition-all duration-300 border-b',
          scrolled
            ? 'border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-amber-500/5'
            : 'border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Animated Logo */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 flex-shrink-0 group"
              aria-label="PetVerse Home"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.08 }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all"
              >
                <span className="text-white text-xl sm:text-2xl select-none">🐾</span>
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Pet<span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Verse</span>
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                    Pet Hub 🐶
                  </span>
                </div>
                <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  Adopt • Reunite • Connect
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-neutral-100/70 dark:bg-neutral-800/70 p-1.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50">
              {publicNavLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === ROUTES.HOME}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 select-none',
                        isActive
                          ? 'text-neutral-900 dark:text-white font-bold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-xl shadow-sm border border-neutral-200/80 dark:border-neutral-600"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 text-base">{link.icon}</span>
                      <span className="relative z-10">{link.label}</span>
                      {link.isAlert && (
                        <span className="relative z-10 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Post Listing CTA */}
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      to={ROUTES.CREATE_LISTING}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-500/25 hover:shadow-orange-500/40"
                    >
                      <FiPlus className="w-4 h-4 stroke-[3]" />
                      Post a Pet 🐾
                    </Link>
                  </motion.div>

                  {/* Saved Pets Wishlist */}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      to={ROUTES.SAVED_PETS}
                      className="relative p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-red-500 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-center"
                      aria-label="Saved Pets Wishlist"
                    >
                      <FiHeart className="w-5 h-5 fill-current opacity-90" />
                    </Link>
                  </motion.div>

                  {/* User Profile Menu — opens on hover */}
                  <div
                    ref={userMenuRef}
                    className="relative"
                    onMouseEnter={openMenu}
                    onMouseLeave={closeMenu}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const uid = user?._id || user?.id;
                        if (uid) navigate(`/profile/${uid}`);
                      }}
                      className="flex items-center gap-2 p-[2px] rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm hover:shadow-md transition-all"
                      aria-label="View my profile"
                    >
                      <div className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm overflow-hidden">
                        {user?.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <UserMenu
                          user={user}
                          onClose={() => setUserMenuOpen(false)}
                          onMouseEnter={openMenu}
                          onMouseLeave={closeMenu}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-4 py-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    Sign In
                  </Link>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      to={ROUTES.REGISTER}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center gap-2"
                    >
                      <span>Get Started</span>
                      <span className="text-base">🐶</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Navigation Toggle Button */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleMobileMenu())}
                className="p-2.5 text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </>
  );
};

export default Header;