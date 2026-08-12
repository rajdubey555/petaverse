import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    mobileMenuOpen: false,
    filterDrawerOpen: false,
    globalLoading: false,
    adminSidebarCollapsed: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setMobileMenuOpen: (state, action) => {
            state.mobileMenuOpen = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        setFilterDrawerOpen: (state, action) => {
            state.filterDrawerOpen = action.payload;
        },
        toggleFilterDrawer: (state) => {
            state.filterDrawerOpen = !state.filterDrawerOpen;
        },
        setGlobalLoading: (state, action) => {
            state.globalLoading = action.payload;
        },
        toggleAdminSidebar: (state) => {
            state.adminSidebarCollapsed = !state.adminSidebarCollapsed;
        },
        setAdminSidebarCollapsed: (state, action) => {
            state.adminSidebarCollapsed = action.payload;
        },
    },
});

export const {
    toggleTheme,
    setMobileMenuOpen,
    toggleMobileMenu,
    setFilterDrawerOpen,
    toggleFilterDrawer,
    setGlobalLoading,
    toggleAdminSidebar,
    setAdminSidebarCollapsed,
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectFilterDrawerOpen = (state) => state.ui.filterDrawerOpen;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectAdminSidebarCollapsed = (state) => state.ui.adminSidebarCollapsed;

export default uiSlice.reducer;