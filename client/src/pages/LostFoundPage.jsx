import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiMapPin,
    FiSearch,
    FiAlertCircle,
    FiHeart,
    FiPlus,
    FiFilter,
    FiCalendar,
    FiEye,
    FiInfo,
    FiArrowRight,
} from 'react-icons/fi';
import { useGetPetsQuery } from '../store/api/petApi';
import { PetGrid } from '../components/pet';
import { Button, Input, Badge, Card, Spinner, EmptyState, SearchBar, Pagination, Select } from '../components/common';
import { ROUTES } from '../config/routes';
import { SPECIES_CONFIG, PAGINATION } from '../config/constants';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { cn } from '../utils/cn';
import useDebounce from '../hooks/useDebounce';

const LostFoundPage = () => {
    const [search, setSearch] = useState('');
    const [species, setSpecies] = useState('');
    const [listingTypeFilter, setListingTypeFilter] = useState(''); // '' (all), 'lost', 'found'
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);

    const queryParams = useMemo(() => ({
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        listingType: listingTypeFilter || 'lost,found',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(species && { species }),
    }), [page, debouncedSearch, species, listingTypeFilter]);

    const { data, isLoading, isFetching, isError, error, refetch } = useGetPetsQuery(queryParams);

    const pets = useMemo(() => data?.data || [], [data]);
    const pagination = useMemo(() => data?.pagination || null, [data]);

    const speciesOptions = [
        { value: '', label: 'All Species' },
        ...Object.entries(SPECIES_CONFIG).map(([key, val]) => ({
            value: key,
            label: `${val.icon} ${val.label}`,
        })),
    ];

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                                    <FiAlertCircle className="w-4 h-4" />
                                    Lost & Found Pet Registry
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                    Help Reunite Pets
                                    <br />
                                    With Their Loved Ones
                                </h1>
                                <p className="mt-3 text-base sm:text-lg text-white/80 max-w-xl">
                                    Browse lost and found pet reports in your area. If you've lost or found a pet,
                                    post a listing immediately to reach nearby pet lovers.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link
                                to={`${ROUTES.CREATE_LISTING}?type=lost`}
                                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                Post Lost Pet
                            </Link>
                            <Link
                                to={`${ROUTES.CREATE_LISTING}?type=found`}
                                className="px-6 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FiPlus className="w-5 h-5 text-green-600" />
                                Post Found Pet
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Info Action Cards */}
            <section className="relative -mt-6 pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <Card className="p-5 border-l-4 border-l-red-500 bg-white dark:bg-neutral-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                        <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">I Lost a Pet</h3>
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                            Create a lost pet report with photos, last seen location, and contact details.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <Card className="p-5 border-l-4 border-l-green-500 bg-white dark:bg-neutral-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <FiHeart className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">I Found a Pet</h3>
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                            Found a stray or lost pet? Post a report to locate their owner safely.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filters & Search Bar */}
            <section className="pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-3 overflow-x-auto">
                            <button
                                onClick={() => { setListingTypeFilter(''); setPage(1); }}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                                    !listingTypeFilter
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                )}
                            >
                                All Lost & Found
                            </button>
                            <button
                                onClick={() => { setListingTypeFilter('lost'); setPage(1); }}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                                    listingTypeFilter === 'lost'
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                )}
                            >
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                Lost Pets Only
                            </button>
                            <button
                                onClick={() => { setListingTypeFilter('found'); setPage(1); }}
                                className={cn(
                                    'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                                    listingTypeFilter === 'found'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                )}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Found Pets Only
                            </button>
                        </div>

                        {/* Search & Species controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <SearchBar
                                value={search}
                                onChange={setSearch}
                                placeholder="Search by pet name, breed, or city location..."
                                className="flex-1"
                            />
                            <Select
                                value={species}
                                onChange={(rawVal) => {
                                    const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                    setSpecies(val);
                                    setPage(1);
                                }}
                                options={speciesOptions}
                                className="w-full sm:w-56"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                            {isLoading ? 'Loading Reports...' : pagination ? `${pagination.totalResults} Report${pagination.totalResults !== 1 ? 's' : ''} Found` : 'Listings'}
                        </h2>
                    </div>

                    {isError ? (
                        <EmptyState
                            icon={FiAlertCircle}
                            title="Failed to Load Reports"
                            description={error?.data?.message || 'Failed to load lost & found listings. Please try again.'}
                            action={{ label: 'Try Again', onClick: refetch }}
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
                            title="No Lost or Found Reports"
                            description={debouncedSearch || species || listingTypeFilter ? 'Try adjusting your search or clearing active filters.' : 'No lost or found pet reports currently listed.'}
                            action={(debouncedSearch || species || listingTypeFilter) ? {
                                label: 'Clear Filters',
                                onClick: () => { setSearch(''); setSpecies(''); setListingTypeFilter(''); setPage(1); },
                            } : undefined}
                        />
                    ) : (
                        <>
                            <PetGrid
                                pets={pets}
                                isLoading={isFetching && !isLoading}
                                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            />
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

                    {/* Post CTA */}
                    {!isLoading && (
                        <motion.div
                            className="mt-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                                <FiInfo className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Have you lost or found a pet?
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-md mx-auto">
                                    Post a listing on PetVerse to broadcast details to nearby pet lovers and reunite pets faster.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <Button as={Link} to={`${ROUTES.CREATE_LISTING}?type=lost`} variant="danger" className="rounded-xl">
                                        Post Lost Pet
                                    </Button>
                                    <Button as={Link} to={`${ROUTES.CREATE_LISTING}?type=found`} variant="success" className="rounded-xl">
                                        Post Found Pet
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LostFoundPage;