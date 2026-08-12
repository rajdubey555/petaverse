import { baseApi } from './baseApi';

export const savedPetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        toggleSave: builder.mutation({
            query: (petId) => ({
                url: '/saved-pets',
                method: 'POST',
                body: { petId },
            }),
            // Invalidate both the list AND the individual pet's checkSaved cache
            invalidatesTags: (result, error, petId) => [
                { type: 'SavedPet', id: 'LIST' },
                { type: 'SavedPet', id: petId },
                { type: 'Pet', id: petId },
            ],
        }),
        getSavedPets: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                return `/saved-pets?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map((item) => ({
                            type: 'SavedPet',
                            id: item.pet?._id || item.pet,
                        })),
                        { type: 'SavedPet', id: 'LIST' },
                    ]
                    : [{ type: 'SavedPet', id: 'LIST' }],
        }),
        checkSaved: builder.query({
            query: (petId) => `/saved-pets/check/${petId}`,
            // Provides tag keyed by the pet's own _id so toggleSave/unsavePet can invalidate it
            providesTags: (result, error, petId) => [
                { type: 'SavedPet', id: petId },
                { type: 'SavedPet', id: 'LIST' },
            ],
        }),
        unsavePet: builder.mutation({
            query: (petId) => ({
                url: `/saved-pets/${petId}`,
                method: 'DELETE',
            }),
            // Invalidate LIST + the individual checkSaved cache for this pet
            invalidatesTags: (result, error, petId) => [
                { type: 'SavedPet', id: 'LIST' },
                { type: 'SavedPet', id: petId },
                { type: 'Pet', id: petId },
            ],
        }),
    }),
});

export const {
    useToggleSaveMutation,
    useGetSavedPetsQuery,
    useCheckSavedQuery,
    useUnsavePetMutation,
} = savedPetApi;