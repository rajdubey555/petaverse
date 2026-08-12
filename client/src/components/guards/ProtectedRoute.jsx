import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useAuth from '../../hooks/useAuth';
import PageLoader from '../common/PageLoader';

/**
 * ProtectedRoute — Restricts access to authenticated users only.
 *
 * Behavior:
 * - If auth is still loading → shows PageLoader
 * - If NOT authenticated → redirects to /login with return URL
 * - If authenticated → renders children
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const location = useLocation();

    if (isAuthLoading) {
        return <PageLoader message="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;