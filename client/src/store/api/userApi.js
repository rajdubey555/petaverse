import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPublicProfile: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        getUserListings: builder.query({
            query: ({ id, ...params }) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/users/${id}/listings?${queryParams.toString()}`;
            },
            providesTags: (result, error, { id }) => [{ type: 'User', id: `listings-${id}` }],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/users/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        rateUser: builder.mutation({
            query: ({ id, rating, comment }) => ({
                url: `/users/${id}/rate`,
                method: 'POST',
                body: { rating, comment },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),
        deleteAccount: builder.mutation({
            query: () => ({
                url: '/users/account',
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetPublicProfileQuery,
    useGetUserListingsQuery,
    useUpdateProfileMutation,
    useRateUserMutation,
    useDeleteAccountMutation,
} = userApi;