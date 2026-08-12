import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from '../common/ToastContainer';
import useScrollToTop from '../../hooks/useScrollToTop';

/**
 * MainLayout — Public-facing layout wrapper.
 *
 * Structure:
 *   <Header />
 *   <main><Outlet /></main>
 *   <Footer />
 *   <ToastContainer />
 *
 * Wraps public pages (Home, Browse, Pet Details, Login, etc.).
 */

const MainLayout = () => {
    useScrollToTop();

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Header />

            <motion.main
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <Outlet />
            </motion.main>

            <Footer />

            <ToastContainer />
        </div>
    );
};

export default MainLayout;