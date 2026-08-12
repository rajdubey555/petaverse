import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiHome, FiExternalLink } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { toggleAdminSidebar } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import UserAvatar from '../user/UserAvatar';
import cn from '../../utils/cn';

const routeTitleMap = {
  '/admin': 'Dashboard Overview',
  '/admin/users': 'User Management',
  '/admin/pets': 'Pet Listings Management',
  '/admin/reports': 'Report & Content Moderation',
};

const AdminHeader = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useAuth();

  const currentPageTitle = routeTitleMap[location.pathname] || 'Admin Center';

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Matching Header Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full" />

      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Sidebar Toggle + Breadcrumb */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => dispatch(toggleAdminSidebar())}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
              {currentPageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Main Site CTA + Admin Avatar */}
        <div className="flex items-center gap-3">

          {/* Visit Main Site Button */}
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all shadow-xs"
            title="Return to Main Website"
          >
            <FiHome className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Main Site</span>
            <FiExternalLink className="w-3 h-3" />
          </Link>

          {/* Admin Avatar & Details */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <UserAvatar
              src={user?.avatar?.url}
              name={user?.name || 'Admin User'}
              size="sm"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 dark:text-white leading-tight truncate max-w-[120px]">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;