import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    setCredentials,
    clearCredentials,
    setLoading,
    selectIsAuthenticated,
    selectCurrentUser,
    selectAuthLoading,
} from '../store/slices/authSlice';
import {
    useGoogleLoginMutation,
    useEmailLoginMutation,
    useEmailRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} from '../store/api/authApi';
import { baseApi } from '../store/api/baseApi';
import { clearToasts } from '../store/slices/toastSlice';

let isAuthInitialized = false;

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authLoading = useSelector(selectAuthLoading);
    const user = useSelector(selectCurrentUser);

    const { isLoading: isAuthLoading } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [googleLogin, { isLoading: isLoginLoading }] = useGoogleLoginMutation();
    const [emailLoginMutation, { isLoading: isEmailLoginLoading }] = useEmailLoginMutation();
    const [emailRegisterMutation, { isLoading: isEmailRegisterLoading }] = useEmailRegisterMutation();
    const [logoutMutation] = useLogoutMutation();

    useEffect(() => {
        if (isAuthInitialized) {
            return;
        }

        isAuthInitialized = true;

        const initAuth = async () => {
            const isAdminPath = window.location.pathname.startsWith('/admin');
            const token = isAdminPath
                ? (sessionStorage.getItem('petaverse_admin_token') || localStorage.getItem('petaverse_admin_token') || sessionStorage.getItem('petaverse_token') || localStorage.getItem('petaverse_token'))
                : (sessionStorage.getItem('petaverse_token') || localStorage.getItem('petaverse_token'));

            if (!token) {
                dispatch(setLoading(false));
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/me`,
                    {
                        credentials: 'include',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const { data } = await response.json();
                    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken || token }));
                } else if (response.status === 401) {
                    dispatch(clearCredentials({ scope: isAdminPath ? 'admin' : 'user' }));
                } else {
                    dispatch(setLoading(false));
                }
            } catch {
                dispatch(setLoading(false));
            }
        };

        initAuth();
    }, [dispatch]);

    const login = useCallback(
        async (credential) => {
            if (!credential || typeof credential !== 'string' || !credential.trim()) {
                throw new Error('Google Client ID is not configured yet. Please paste your Google Client ID into client/.env and server/.env files.');
            }
            const result = await googleLogin({ credential: credential.trim() }).unwrap();
            dispatch(
                setCredentials({
                    user: result.data.user,
                    accessToken: result.data.accessToken,
                })
            );
            return result;
        },
        [googleLogin, dispatch]
    );

    const loginWithEmail = useCallback(
        async ({ email, password }) => {
            const result = await emailLoginMutation({ email, password }).unwrap();
            dispatch(
                setCredentials({
                    user: result.data.user,
                    accessToken: result.data.accessToken,
                })
            );
            return result;
        },
        [emailLoginMutation, dispatch]
    );

    const registerWithEmail = useCallback(
        async (userData) => {
            const result = await emailRegisterMutation(userData).unwrap();
            dispatch(
                setCredentials({
                    user: result.data.user,
                    accessToken: result.data.accessToken,
                })
            );
            return result;
        },
        [emailRegisterMutation, dispatch]
    );

    const logout = useCallback(async () => {
        const isAdminPath = location.pathname.startsWith('/admin');
        try {
            await logoutMutation().unwrap();
        } catch {
            // Ignore API logout errors
        }
        dispatch(clearCredentials({ scope: isAdminPath ? 'admin' : 'user' }));
        dispatch(clearToasts());
        dispatch(baseApi.util.resetApiState());
        navigate(isAdminPath ? '/login' : '/', { replace: true });
    }, [logoutMutation, dispatch, navigate, location.pathname]);

    return {
        isAuthenticated,
        user,
        isAuthLoading,
        isLoginLoading,
        isEmailLoginLoading,
        isEmailRegisterLoading,
        login,
        loginWithEmail,
        registerWithEmail,
        logout,
    };
};

export { useAuth };
export default useAuth;