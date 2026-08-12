import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiSliders,
  FiX,
  FiGrid,
  FiList,
  FiMapPin,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiCheckCircle,
  FiStar,
  FiShield,
} from 'react-icons/fi';
import { useGetPetsQuery } from '../store/api/petApi';
import { PetGrid } from '../components/pet';
import { Button, Input, Select, SearchBar, Pagination, Spinner, EmptyState, Card, Badge } from '../components/common';
import { ROUTES } from '../config/routes';
import { SPECIES_CONFIG, LISTING_TYPES, PAGINATION, SORT_OPTIONS, SIZES, GENDERS } from '../config/constants';
import { cn } from '../utils/cn';
import useDebounce from '../hooks/useDebounce';

const SPECIES_OPTIONS = Object.entries(SPECIES_CONFIG).map(([key, val]) => ({
  value: key,
  label: `${val.icon} ${val.label}`,
}));

const LISTING_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'adoption', label: 'Adoption' },
  { value: 'rehoming', label: 'Rehoming' },
  { value: 'sale', label: 'For Sale' },
  { value: 'lost', label: 'Lost Pets' },
  { value: 'found', label: 'Found Pets' },
];

const SIZE_OPTIONS = [
  { value: '', label: 'All Sizes' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'male', label: 'Male ♂' },
  { value: 'female', label: 'Female ♀' },
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price' },
  { value: '0-5000', label: 'Under ₹5,000' },
  { value: '5000-15000', label: '₹5,000 - ₹15,000' },
  { value: '15000-30000', label: '₹15,000 - ₹30,000' },
  { value: '30000-50000', label: '₹30,000 - ₹50,000' },
  { value: '50000-', label: 'Above ₹50,000' },
];

const SORT_OPTIONS_FULL = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-viewCount', label: 'Most Popular' },
  { value: 'name', label: 'Name: A-Z' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
      >
        {title}
        {isOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BrowsePetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [species, setSpecies] = useState(searchParams.get('species') || '');
  const [listingType, setListingType] = useState(searchParams.get('listingType') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '');
  const [vaccinated, setVaccinated] = useState(searchParams.get('vaccinated') === 'true');
  const [neutered, setNeutered] = useState(searchParams.get('neutered') === 'true');
  const [isFeatured, setIsFeatured] = useState(searchParams.get('isFeatured') === 'true');
  const [isVerified, setIsVerified] = useState(searchParams.get('isVerified') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '-createdAt');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(city, 400);

  // Keep state in sync with URL parameters
  useEffect(() => {
    const urlSpecies = searchParams.get('species') || '';
    const urlListingType = searchParams.get('listingType') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSize = searchParams.get('size') || '';
    const urlGender = searchParams.get('gender') || '';
    const urlCity = searchParams.get('city') || '';
    const urlPriceRange = searchParams.get('priceRange') || '';
    const urlVaccinated = searchParams.get('vaccinated') === 'true';
    const urlNeutered = searchParams.get('neutered') === 'true';
    const urlFeatured = searchParams.get('isFeatured') === 'true';
    const urlVerified = searchParams.get('isVerified') === 'true';
    const urlSortBy = searchParams.get('sortBy') || '-createdAt';
    const urlPage = Number(searchParams.get('page')) || 1;

    setSpecies((prev) => (prev !== urlSpecies ? urlSpecies : prev));
    setListingType((prev) => (prev !== urlListingType ? urlListingType : prev));
    setSearch((prev) => (prev !== urlSearch ? urlSearch : prev));
    setSize((prev) => (prev !== urlSize ? urlSize : prev));
    setGender((prev) => (prev !== urlGender ? urlGender : prev));
    setCity((prev) => (prev !== urlCity ? urlCity : prev));
    setPriceRange((prev) => (prev !== urlPriceRange ? urlPriceRange : prev));
    setVaccinated((prev) => (prev !== urlVaccinated ? urlVaccinated : prev));
    setNeutered((prev) => (prev !== urlNeutered ? urlNeutered : prev));
    setIsFeatured((prev) => (prev !== urlFeatured ? urlFeatured : prev));
    setIsVerified((prev) => (prev !== urlVerified ? urlVerified : prev));
    setSortBy((prev) => (prev !== urlSortBy ? urlSortBy : prev));
    setPage((prev) => (prev !== urlPage ? urlPage : prev));
  }, [searchParams]);

  // Keep URL parameters in sync with filter state
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (species) params.species = species;
    if (listingType) params.listingType = listingType;
    if (size) params.size = size;
    if (gender) params.gender = gender;
    if (city) params.city = city;
    if (priceRange) params.priceRange = priceRange;
    if (vaccinated) params.vaccinated = 'true';
    if (neutered) params.neutered = 'true';
    if (isFeatured) params.isFeatured = 'true';
    if (isVerified) params.isVerified = 'true';
    if (sortBy && sortBy !== '-createdAt') params.sortBy = sortBy;
    if (page && page !== 1) params.page = page;

    const currentString = searchParams.toString();
    const newString = new URLSearchParams(params).toString();

    if (currentString !== newString) {
      setSearchParams(params, { replace: true });
    }
  }, [
    search, species, listingType, size, gender, city, priceRange,
    vaccinated, neutered, isFeatured, isVerified, sortBy, page,
    searchParams, setSearchParams
  ]);

  const queryParams = useMemo(() => {
    const params = { page, limit: PAGINATION.DEFAULT_LIMIT, sort: sortBy };
    if (debouncedSearch) params.search = debouncedSearch;
    if (species) params.species = species;
    if (listingType) params.listingType = listingType;
    if (size) params.size = size;
    if (gender) params.gender = gender;
    if (debouncedCity) params.city = debouncedCity;
    if (vaccinated) params.vaccinated = true;
    if (neutered) params.neutered = true;
    if (isFeatured) params.isFeatured = true;
    if (isVerified) params.isVerified = true;
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.priceMin = min;
      if (max) params.priceMax = max;
    }
    return params;
  }, [
    debouncedSearch, species, listingType, size, gender, debouncedCity,
    vaccinated, neutered, isFeatured, isVerified, priceRange, sortBy, page
  ]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetPetsQuery(queryParams);

  const pets = useMemo(() => data?.data || [], [data]);
  const pagination = useMemo(() => data?.pagination || null, [data]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (species) count++;
    if (listingType) count++;
    if (size) count++;
    if (gender) count++;
    if (city) count++;
    if (priceRange) count++;
    if (vaccinated) count++;
    if (neutered) count++;
    if (isFeatured) count++;
    if (isVerified) count++;
    return count;
  }, [species, listingType, size, gender, city, priceRange, vaccinated, neutered, isFeatured, isVerified]);

  const clearAllFilters = () => {
    setSpecies('');
    setListingType('');
    setSize('');
    setGender('');
    setCity('');
    setPriceRange('');
    setVaccinated(false);
    setNeutered(false);
    setIsFeatured(false);
    setIsVerified(false);
    setSearch('');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FiltersPanel = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <FiSliders className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* City Location Filter */}
      <FilterSection title="Location (City)">
        <div className="relative">
          <Input
            type="text"
            placeholder="e.g. Delhi, Mumbai..."
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1); }}
            leftIcon={FiMapPin}
            className="text-xs"
          />
        </div>
      </FilterSection>

      {/* Species Filter */}
      <FilterSection title="Species Category">
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => { setSpecies(''); setPage(1); }}
            className={cn(
              'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              !species
                ? 'bg-amber-500 text-white font-semibold shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            All Species
          </button>
          {SPECIES_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setSpecies(opt.value); setPage(1); }}
              className={cn(
                'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between',
                species === opt.value
                  ? 'bg-amber-500 text-white font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Listing Type Filter */}
      <FilterSection title="Listing Type">
        <div className="space-y-1">
          {LISTING_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => { setListingType(opt.value); setPage(1); }}
              className={cn(
                'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                listingType === opt.value
                  ? 'bg-amber-500 text-white font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection title="Gender">
        <div className="grid grid-cols-3 gap-1.5">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => { setGender(opt.value); setPage(1); }}
              className={cn(
                'px-2 py-1.5 rounded-lg text-xs text-center font-medium transition-colors',
                gender === opt.value
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {opt.value === '' ? 'Any' : opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title="Pet Size">
        <div className="grid grid-cols-2 gap-1.5">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => { setSize(opt.value); setPage(1); }}
              className={cn(
                'px-2 py-1.5 rounded-lg text-xs text-center font-medium transition-colors',
                size === opt.value
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {opt.value === '' ? 'Any Size' : opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value || 'any'}
              type="button"
              onClick={() => { setPriceRange(range.value); setPage(1); }}
              className={cn(
                'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                priceRange === range.value
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Health & Verification Checkboxes */}
      <FilterSection title="Health & Verification">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={vaccinated}
              onChange={(e) => { setVaccinated(e.target.checked); setPage(1); }}
              className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
            />
            💉 Vaccinated Only
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={neutered}
              onChange={(e) => { setNeutered(e.target.checked); setPage(1); }}
              className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
            />
            ✂️ Neutered / Spayed
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => { setIsFeatured(e.target.checked); setPage(1); }}
              className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
            />
            ⭐ Featured Listings
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => { setIsVerified(e.target.checked); setPage(1); }}
              className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
            />
            ✅ Verified Listings
          </label>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Explore Available Pets 🐶🐱
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Find dogs, cats, birds, fishes, rabbits and more looking for loving homes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold shadow-sm"
            >
              <FiSliders className="w-4 h-4 text-amber-500" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              options={SORT_OPTIONS_FULL}
              className="w-48 text-xs font-medium"
            />
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <FiltersPanel />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Search Bar */}
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col sm:flex-row gap-3">
              <SearchBar
                value={search}
                onChange={(val) => { setSearch(val); setPage(1); }}
                placeholder="Search by breed, pet name, or keywords..."
                className="flex-1"
              />
            </div>

            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Active Filters:</span>
                {species && (
                  <Badge variant="primary" size="sm">
                    Species: {species}
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSpecies('')} />
                  </Badge>
                )}
                {listingType && (
                  <Badge variant="secondary" size="sm">
                    Type: {listingType}
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setListingType('')} />
                  </Badge>
                )}
                {city && (
                  <Badge variant="neutral" size="sm">
                    City: {city}
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCity('')} />
                  </Badge>
                )}
                {gender && (
                  <Badge variant="neutral" size="sm">
                    Gender: {gender}
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setGender('')} />
                  </Badge>
                )}
                {size && (
                  <Badge variant="neutral" size="sm">
                    Size: {size}
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSize('')} />
                  </Badge>
                )}
                {priceRange && (
                  <Badge variant="accent" size="sm">
                    Price Range
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPriceRange('')} />
                  </Badge>
                )}
                {vaccinated && (
                  <Badge variant="success" size="sm">
                    Vaccinated
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setVaccinated(false)} />
                  </Badge>
                )}
                {neutered && (
                  <Badge variant="success" size="sm">
                    Neutered
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setNeutered(false)} />
                  </Badge>
                )}
                {isFeatured && (
                  <Badge variant="warning" size="sm">
                    Featured
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setIsFeatured(false)} />
                  </Badge>
                )}
                {isVerified && (
                  <Badge variant="primary" size="sm">
                    Verified
                    <FiX className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setIsVerified(false)} />
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:underline font-semibold ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Total Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {isLoading ? 'Searching Pets...' : pagination ? `Showing ${pagination.totalResults} Pet${pagination.totalResults !== 1 ? 's' : ''}` : 'Listings'}
              </p>
            </div>

            {/* Pet Grid / Error / Empty States */}
            {isError ? (
              <EmptyState
                icon={FiFilter}
                title="No pets found matching filters"
                description={error?.data?.message || 'Failed to load pet listings. Please try adjusting your filters.'}
                action={{ label: 'Clear Filters', onClick: clearAllFilters }}
              />
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pets.length === 0 ? (
              <EmptyState
                icon={FiHeart}
                title="No pets found"
                description="We couldn't find any pets matching your active filter criteria."
                action={{ label: 'Reset All Filters', onClick: clearAllFilters }}
              />
            ) : (
              <>
                <PetGrid
                  pets={pets}
                  isLoading={isFetching && !isLoading}
                  className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white dark:bg-neutral-800 p-6 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Filter Options</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <FiltersPanel />
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-xl"
                >
                  Apply Filters ({pets.length})
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowsePetsPage;