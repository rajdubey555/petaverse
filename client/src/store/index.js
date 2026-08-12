import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import filterReducer from './slices/filterSlice';
import toastReducer, { addToast } from './slices/toastSlice';
import { extractErrorMessage } from '../utils/errorUtils';

const toastMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type?.endsWith('/fulfilled')) {
    const endpointName = action.meta?.arg?.endpointName;
    const successMessages = {
      createPet: 'Pet listing created successfully!',
      updatePet: 'Listing updated.',
      deletePet: 'Listing removed.',
      toggleSave: action.payload?.data?.saved
        ? 'Pet saved!'
        : 'Pet removed from saved.',
      updateProfile: 'Profile updated.',
      deleteAccount: 'Account deleted.',
      createReport: 'Report submitted. Thank you for helping keep PetVerse safe.',
      deleteReport: 'Report removed.',
      uploadSingle: 'Image uploaded successfully.',
      logout: 'Signed out successfully. See you soon! 👋',
    };

    if (successMessages[endpointName]) {
      const message =
        typeof successMessages[endpointName] === 'function'
          ? successMessages[endpointName](action.payload)
          : successMessages[endpointName];
      store.dispatch(addToast({ type: 'success', message }));
    }
  }

  if (action.type?.endsWith('/rejected')) {
    const err = action.payload || action.error;
    // Skip abort/cancel errors (e.g. logout mutation being cancelled)
    const isAbort =
      err?.name === 'AbortError' ||
      err?.message === 'Aborted' ||
      err?.message === 'AbortError' ||
      action.error?.name === 'AbortError' ||
      action.meta?.condition === true;
    if (!isAbort) {
      const message = extractErrorMessage(err);
      if (message && !action.type?.startsWith('api/executeMutation/pending')) {
        store.dispatch(addToast({ type: 'error', message }));
      }
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    filter: filterReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, toastMiddleware),
  devTools: import.meta.env.DEV,
});