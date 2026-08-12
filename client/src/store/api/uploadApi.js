import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadSingle: builder.mutation({
            query: (formData) => ({
                url: '/upload/single',
                method: 'POST',
                body: formData,
            }),
        }),
        uploadMultiple: builder.mutation({
            query: (formData) => ({
                url: '/upload/multiple',
                method: 'POST',
                body: formData,
            }),
        }),
        deleteImage: builder.mutation({
            query: (publicId) => ({
                url: '/upload',
                method: 'DELETE',
                body: { publicId },
            }),
        }),
    }),
});

export const { useUploadSingleMutation, useUploadMultipleMutation, useDeleteImageMutation } =
    uploadApi;