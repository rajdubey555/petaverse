import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiUser,
    FiList,
    FiHeart,
    FiLogOut,
    FiShield,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import useAuth from '../../hooks/useAuth';

const menuItems = [
    { label: 'My Profile',  icon: FiUser,  getTo: (uId) => (uId ? `/profile/${uId}` : '/login') },
    { label: 'My Listings', icon: FiList,  getTo: () => ROUTES.MY_LISTINGS },
    { label: 'Saved Pets',  icon: FiHeart, getTo: () => ROUTES.SAVED_PETS  },
];

const UserMenu = ({ user: propUser, onClose, onMouseEnter, onMouseLeave }) => {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();

    const currentUser = propUser || authUser;
    const userId = currentUser?._id || currentUser?.id;

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate(ROUTES.HOME);
    };

    const handleNavigate = (targetPath) => {
        onClose();
        navigate(targetPath);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
        >
            {/* Name & email */}
            <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {currentUser?.email || ''}
                </p>
            </div>

            {/* Menu items */}
            <div className="py-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const targetPath = item.getTo(userId);
                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => handleNavigate(targetPath)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
                        >
                            <Icon className="w-4 h-4 text-neutral-400" />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Admin link */}
            {currentUser?.role === 'admin' && (
                <>
                    <div className="border-t border-neutral-100 dark:border-neutral-700" />
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => handleNavigate(ROUTES.ADMIN.DASHBOARD)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
                        >
                            <FiShield className="w-4 h-4" />
                            Admin Dashboard
                        </button>
                    </div>
                </>
            )}

            {/* Sign Out */}
            <div className="border-t border-neutral-100 dark:border-neutral-700" />
            <div className="py-1">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
};

export default UserMenu;