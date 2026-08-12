import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: {
            reducer: (state, action) => {
                state.toasts.push(action.payload);
            },
            prepare: ({ type = 'info', message, duration = null }) => {
                const defaultDurations = {
                    success: 4000,
                    error: 6000,
                    warning: 5000,
                    info: 4000,
                };
                return {
                    payload: {
                        id: nanoid(),
                        type,
                        message,
                        duration: duration ?? defaultDurations[type] ?? 4000,
                        createdAt: Date.now(),
                    },
                };
            },
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },
    },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

export const selectToasts = (state) => state.toast.toasts;

export default toastSlice.reducer;