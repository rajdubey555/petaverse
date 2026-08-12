import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/constants';
import { setCredentials, clearCredentials } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    let token = getState().auth.accessToken;

    if (typeof window !== 'undefined') {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      if (isAdminPath) {
        const adminToken =
          sessionStorage.getItem('petaverse_admin_token') ||
          localStorage.getItem('petaverse_admin_token');
        if (adminToken) token = adminToken;
      }
      if (!token) {
        token =
          sessionStorage.getItem('petaverse_token') ||
          localStorage.getItem('petaverse_token');
      }
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },

});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { user, accessToken } = refreshResult.data.data;
      api.dispatch(setCredentials({ user, accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Pet', 'User', 'SavedPet', 'Report', 'AdminUser', 'AdminPet', 'AdminReport', 'Dashboard'],
  endpoints: () => ({}),
});