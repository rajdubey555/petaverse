import { createSlice } from '@reduxjs/toolkit';
import { PAGINATION } from '../../config/constants';

const initialState = {
    search: '',
    species: [],
    listingType: [],
    size: [],
    gender: [],
    ageMin: null,
    ageMax: null,
    priceMin: null,
    priceMax: null,
    sort: '-createdAt',
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
            state.page = 1;
        },
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
            state.page = 1;
        },
        toggleFilterValue: (state, action) => {
            const { key, value } = action.payload;
            const arr = state[key];
            if (!Array.isArray(arr)) return;
            const index = arr.indexOf(value);
            if (index === -1) {
                arr.push(value);
            } else {
                arr.splice(index, 1);
            }
            state.page = 1;
        },
        clearAllFilters: (state) => {
            state.search = '';
            state.species = [];
            state.listingType = [];
            state.size = [];
            state.gender = [];
            state.ageMin = null;
            state.ageMax = null;
            state.priceMin = null;
            state.priceMax = null;
            state.sort = '-createdAt';
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSort: (state, action) => {
            state.sort = action.payload;
            state.page = 1;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
            state.page = 1;
        },
        resetFilters: () => initialState,
    },
});

export const {
    setSearch,
    setFilter,
    toggleFilterValue,
    clearAllFilters,
    setPage,
    setSort,
    setLimit,
    resetFilters,
} = filterSlice.actions;

export const selectFilters = (state) => state.filter;
export const selectSearchQuery = (state) => state.filter.search;
export const selectActiveFilterCount = (state) => {
    const f = state.filter;
    return f.species.length + f.listingType.length + f.size.length + f.gender.length +
        (f.ageMin !== null ? 1 : 0) + (f.ageMax !== null ? 1 : 0) +
        (f.priceMin !== null ? 1 : 0) + (f.priceMax !== null ? 1 : 0);
};

export default filterSlice.reducer;