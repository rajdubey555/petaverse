import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, isAuthenticated: false, isLoading: false };
  }

  const isAdminPath = window.location.pathname.startsWith('/admin');

  let token = null;
  let userRaw = null;

  if (isAdminPath) {
    // If on /admin route, prioritize admin tab sessionStorage, then admin localStorage
    token =
      sessionStorage.getItem('petaverse_admin_token') ||
      localStorage.getItem('petaverse_admin_token') ||
      sessionStorage.getItem('petaverse_token') ||
      localStorage.getItem('petaverse_token');

    userRaw =
      sessionStorage.getItem('petaverse_admin_user') ||
      localStorage.getItem('petaverse_admin_user') ||
      sessionStorage.getItem('petaverse_user') ||
      localStorage.getItem('petaverse_user');
  } else {
    // Standard user route: prioritize user tab sessionStorage, then user localStorage
    token =
      sessionStorage.getItem('petaverse_token') ||
      localStorage.getItem('petaverse_token');

    userRaw =
      sessionStorage.getItem('petaverse_user') ||
      localStorage.getItem('petaverse_user');
  }

  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  return {
    user,
    accessToken: token,
    isAuthenticated: !!(token && user),
    isLoading: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user) state.user = user;
      if (accessToken) state.accessToken = accessToken;
      state.isAuthenticated = !!(state.user && state.accessToken);
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        const isAdminUser = state.user?.role === 'admin';
        const userStr = JSON.stringify(state.user);

        if (isAdminUser) {
          // Store in admin specific keys (tab sessionStorage + persistent localStorage)
          if (state.accessToken) {
            sessionStorage.setItem('petaverse_admin_token', state.accessToken);
            localStorage.setItem('petaverse_admin_token', state.accessToken);
          }
          if (state.user) {
            sessionStorage.setItem('petaverse_admin_user', userStr);
            localStorage.setItem('petaverse_admin_user', userStr);
          }
        } else {
          // Standard user keys (tab sessionStorage + persistent localStorage)
          if (state.accessToken) {
            sessionStorage.setItem('petaverse_token', state.accessToken);
            localStorage.setItem('petaverse_token', state.accessToken);
          }
          if (state.user) {
            sessionStorage.setItem('petaverse_user', userStr);
            localStorage.setItem('petaverse_user', userStr);
          }
        }
      }
    },
    clearCredentials: (state, action) => {
      const scope = action?.payload?.scope; // 'admin' | 'user' | undefined
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      const isTargetAdmin = scope === 'admin' || (scope === undefined && isAdminPath);

      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        if (isTargetAdmin) {
          // Clear ONLY Admin session keys for this tab & global admin storage
          sessionStorage.removeItem('petaverse_admin_token');
          sessionStorage.removeItem('petaverse_admin_user');
          localStorage.removeItem('petaverse_admin_token');
          localStorage.removeItem('petaverse_admin_user');
        } else {
          // Clear ONLY User session keys for this tab & global user storage
          sessionStorage.removeItem('petaverse_token');
          sessionStorage.removeItem('petaverse_user');
          localStorage.removeItem('petaverse_token');
          localStorage.removeItem('petaverse_user');
        }
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (typeof window !== 'undefined' && state.user) {
        const userStr = JSON.stringify(state.user);
        if (state.user.role === 'admin') {
          sessionStorage.setItem('petaverse_admin_user', userStr);
          localStorage.setItem('petaverse_admin_user', userStr);
        } else {
          sessionStorage.setItem('petaverse_user', userStr);
          localStorage.setItem('petaverse_user', userStr);
        }
      }
    },
  },
});

export const { setCredentials, clearCredentials, setLoading, updateUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;