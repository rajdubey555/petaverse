import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => '/admin/dashboard',
            providesTags: ['Dashboard'],
        }),
        getUsers: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/admin/users?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'AdminUser', id: _id })),
                        { type: 'AdminUser', id: 'LIST' },
                    ]
                    : [{ type: 'AdminUser', id: 'LIST' }],
        }),
        getAdminPets: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/admin/pets?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'AdminPet', id: _id })),
                        { type: 'AdminPet', id: 'LIST' },
                    ]
                    : [{ type: 'AdminPet', id: 'LIST' }],
        }),
        getAdminReports: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/admin/reports?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'AdminReport', id: _id })),
                        { type: 'AdminReport', id: 'LIST' },
                    ]
                    : [{ type: 'AdminReport', id: 'LIST' }],
        }),
        toggleUserStatus: builder.mutation({
            query: ({ id, isActive }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                body: { isActive },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminUser', id },
                { type: 'AdminUser', id: 'LIST' },
            ],
        }),
        togglePetFeature: builder.mutation({
            query: (id) => ({
                url: `/admin/pets/${id}/feature`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'AdminPet', id },
                { type: 'AdminPet', id: 'LIST' },
                { type: 'Pet', id },
                { type: 'Pet', id: 'FEATURED' },
            ],
        }),
        deleteAdminPet: builder.mutation({
            query: (id) => ({
                url: `/admin/pets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'AdminPet', id },
                { type: 'AdminPet', id: 'LIST' },
                { type: 'Pet', id },
                { type: 'Pet', id: 'LIST' },
                { type: 'Pet', id: 'FEATURED' },
                'Dashboard',
            ],
        }),
        updateReportStatus: builder.mutation({
            query: ({ id, status, adminNotes }) => ({
                url: `/admin/reports/${id}/status`,
                method: 'PATCH',
                body: { status, adminNotes },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminReport', id },
                { type: 'AdminReport', id: 'LIST' },
                'Dashboard',
            ],
        }),
    }),
});

export const {
    useGetDashboardQuery,
    useGetUsersQuery,
    useGetAdminPetsQuery,
    useGetAdminReportsQuery,
    useToggleUserStatusMutation,
    useTogglePetFeatureMutation,
    useDeleteAdminPetMutation,
    useUpdateReportStatusMutation,
} = adminApi;