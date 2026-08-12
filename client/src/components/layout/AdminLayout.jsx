import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ToastContainer from '../common/ToastContainer';
import useScrollToTop from '../../hooks/useScrollToTop';
import cn from '../../utils/cn';

/**
 * AdminLayout — Layout wrapper for all admin pages.
 * Matches main application design system & font colors.
 */

const AdminLayout = () => {
    useScrollToTop();
    const collapsed = useSelector((state) => state.ui.adminSidebarCollapsed);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased">
            <AdminSidebar />

            <div
                className={cn(
                    'flex-1 flex flex-col transition-all duration-300 min-h-screen',
                    collapsed ? 'lg:ml-[72px]' : 'lg:ml-60'
                )}
            >
                <AdminHeader />

                <motion.main
                    className="flex-1 p-4 sm:p-6 lg:px-8 lg:py-6 w-full max-w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Outlet />
                </motion.main>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AdminLayout;