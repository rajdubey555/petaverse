import { baseApi } from './baseApi';

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReport: builder.mutation({
            query: ({ petId, reportedUserId, reason, description }) => ({
                url: '/reports',
                method: 'POST',
                body: { petId, reportedUserId, reason, description },
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),
        getMyReports: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/reports/my-reports?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Report', id: _id })),
                        { type: 'Report', id: 'LIST' },
                    ]
                    : [{ type: 'Report', id: 'LIST' }],
        }),
        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/reports/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Report', id: 'LIST' }],
        }),
    }),
});

export const { useCreateReportMutation, useGetMyReportsQuery, useDeleteReportMutation } = reportApi;