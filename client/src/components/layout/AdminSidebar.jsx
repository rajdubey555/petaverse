import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiUsers,
  FiHeart,
  FiFlag,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { toggleAdminSidebar } from '../../store/slices/uiSlice';
import cn from '../../utils/cn';

const sidebarLinks = [
  { to: ROUTES.ADMIN.DASHBOARD, icon: FiGrid, label: 'Overview' },
  { to: ROUTES.ADMIN.USERS, icon: FiUsers, label: 'Manage Users' },
  { to: ROUTES.ADMIN.PETS, icon: FiHeart, label: 'Manage Pets' },
  { to: ROUTES.ADMIN.REPORTS, icon: FiFlag, label: 'Manage Reports' },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.adminSidebarCollapsed);

  const linkClasses = ({ isActive }) =>
    cn(
      'group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 overflow-hidden whitespace-nowrap',
      isActive
        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
        : 'text-neutral-600 dark:text-neutral-400 hover:bg-amber-50 dark:hover:bg-neutral-800 hover:text-amber-600 dark:hover:text-amber-400'
    );

  return (
    <motion.aside
      className={cn(
        'hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-30 transition-all duration-300 shadow-sm'
      )}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full flex-shrink-0" />

      {/* Sidebar Header Brand */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        {!collapsed ? (
          <NavLink to={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white text-lg select-none">🐾</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                Pet<span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Verse</span>
              </span>
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">
                Admin Center ⚡
              </span>
            </div>
          </NavLink>
        ) : (
          <NavLink to={ROUTES.HOME} className="w-9 h-9 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-amber-500/25">
            <span className="text-white text-lg select-none">🐾</span>
          </NavLink>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">

        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink end key={link.to} to={link.to} className={linkClasses} title={collapsed ? link.label : undefined}>
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}

        <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
          <NavLink
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            title={collapsed ? 'Main Website' : undefined}
          >
            <FiHome className="w-4.5 h-4.5 flex-shrink-0" />
            {!collapsed && <span>Main Website</span>}
          </NavLink>
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
        <button
          type="button"
          onClick={() => dispatch(toggleAdminSidebar())}
          className="w-full flex items-center justify-center p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-xl transition-all text-xs font-bold gap-2"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <FiChevronRight className="w-4 h-4" />
          ) : (
            <>
              <FiChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;