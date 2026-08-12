import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useAuth from '../../hooks/useAuth';
import PageLoader from '../common/PageLoader';

/**
 * GuestRoute — Restricts access to unauthenticated users only.
 *
 * Behavior:
 * - If auth is still loading → shows PageLoader
 * - If authenticated → redirects to home (or previous page)
 * - If NOT authenticated → renders children
 *
 * Used for: Login, Register pages (shouldn't be accessible when logged in)
 */
const GuestRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <PageLoader message="Loading..." />;
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default GuestRoute;