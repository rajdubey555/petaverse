import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useAuth from '../../hooks/useAuth';
import PageLoader from '../common/PageLoader';

/**
 * AdminRoute — Restricts access to admin users only.
 *
 * Behavior:
 * - If auth is still loading → shows PageLoader
 * - If NOT authenticated → redirects to /login
 * - If authenticated but NOT admin → redirects to home
 * - If authenticated AND admin → renders children
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <PageLoader message="Verifying admin access..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default AdminRoute;