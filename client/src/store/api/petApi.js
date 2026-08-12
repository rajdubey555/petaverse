import { baseApi } from './baseApi';

export const petApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPets: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (Array.isArray(value) && value.length > 0) {
                            queryParams.append(key, value.join(','));
                        } else if (!Array.isArray(value)) {
                            queryParams.append(key, value);
                        }
                    }
                });
                return `/pets?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Pet', id: _id })),
                        { type: 'Pet', id: 'LIST' },
                    ]
                    : [{ type: 'Pet', id: 'LIST' }],
        }),
        getPetById: builder.query({
            query: (id) => `/pets/${id}`,
            providesTags: (result, error, id) => [{ type: 'Pet', id }],
        }),
        getFeaturedPets: builder.query({
            query: (args = 12) => {
                if (typeof args === 'object' && args !== null) {
                    const queryParams = new URLSearchParams(args);
                    return `/pets/featured?${queryParams.toString()}`;
                }
                return `/pets/featured?limit=${args}`;
            },
            providesTags: [{ type: 'Pet', id: 'FEATURED' }],
        }),
        getSearchSuggestions: builder.query({
            query: (query) => `/pets/search/suggestions?q=${encodeURIComponent(query)}`,
        }),
        incrementView: builder.mutation({
            query: (id) => ({
                url: `/pets/${id}/view`,
                method: 'POST',
            }),
        }),
        createPet: builder.mutation({
            query: (formData) => ({
                url: '/pets',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Pet', id: 'LIST' }, { type: 'Pet', id: 'FEATURED' }],
        }),
        updatePet: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/pets/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Pet', id },
                { type: 'Pet', id: 'LIST' },
                { type: 'Pet', id: 'FEATURED' },
            ],
        }),
        deletePet: builder.mutation({
            query: (id) => ({
                url: `/pets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Pet', id: 'LIST' }, { type: 'Pet', id: 'FEATURED' }],
        }),
        getSpeciesStats: builder.query({
            query: () => '/pets/stats/species',
            providesTags: [{ type: 'Pet', id: 'STATS' }],
        }),
    }),
});

export const {
    useGetPetsQuery,
    useGetPetByIdQuery,
    useGetFeaturedPetsQuery,
    useGetSearchSuggestionsQuery,
    useGetSpeciesStatsQuery,
    useIncrementViewMutation,
    useCreatePetMutation,
    useUpdatePetMutation,
    useDeletePetMutation,
} = petApi;