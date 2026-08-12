import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        googleLogin: builder.mutation({
            query: ({ credential }) => ({
                url: '/auth/google',
                method: 'POST',
                body: { credential },
            }),
        }),
        emailRegister: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        emailLogin: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: [
                'Pet',
                'User',
                'SavedPet',
                'Report',
                'AdminUser',
                'AdminPet',
                'AdminReport',
                'Dashboard',
            ],
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGoogleLoginMutation,
    useEmailRegisterMutation,
    useEmailLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApi;