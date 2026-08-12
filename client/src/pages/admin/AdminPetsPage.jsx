import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiHeart,
    FiSearch,
    FiRefreshCw,
    FiAlertCircle,
    FiFilter,
} from 'react-icons/fi';
import {
    useGetAdminPetsQuery,
    useTogglePetFeatureMutation,
    useDeleteAdminPetMutation,
} from '../../store/api/adminApi';
import { ROUTES, build } from '../../config/routes';
import { PAGINATION, SPECIES_CONFIG } from '../../config/constants';
import SEO from '../../components/common/SEO';
import DataTable from '../../components/admin/DataTable';
import PetRow from '../../components/admin/PetRow';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
};

const speciesOptions = [
    { value: '', label: 'All Species' },
    ...Object.entries(SPECIES_CONFIG).map(([key, val]) => ({
        value: key,
        label: `${val.icon} ${val.label}`,
    })),
];

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'adopted', label: 'Adopted' },
    { value: 'rehomed', label: 'Rehomed' },
    { value: 'sold', label: 'Sold' },
    { value: 'pending', label: 'Pending' },
    { value: 'removed', label: 'Removed' },
];

const columns = [
    { key: 'pet', label: 'Pet Listing', sortable: false },
    { key: 'type', label: 'Listing Type', sortable: false, width: '130px' },
    { key: 'price', label: 'Price / Adoption', sortable: false, width: '140px' },
    { key: 'owner', label: 'Pet Parent / Shelter', sortable: false, width: '150px' },
    { key: 'status', label: 'Status', sortable: false, width: '120px' },
    { key: 'featured', label: 'Featured', sortable: false, width: '90px', className: 'text-center' },
    { key: 'views', label: 'Views', sortable: false, width: '90px', className: 'text-center' },
    { key: 'actions', label: 'Actions', sortable: false, width: '140px' },
];

const AdminPetsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [togglingIds, setTogglingIds] = useState(new Set());

    const debouncedSearch = useDebounce(search, 400);

    const queryParams = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(speciesFilter && { species: speciesFilter }),
        ...(statusFilter && { status: statusFilter }),
    };

    const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminPetsQuery(queryParams);
    const [togglePetFeature] = useTogglePetFeatureMutation();
    const [deletePet] = useDeleteAdminPetMutation();

    const pets = data?.data || [];
    const pagination = data?.pagination;

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleSpeciesChange = useCallback((value) => {
        setSpeciesFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleFeature = useCallback(async (petId) => {
        setTogglingIds((prev) => new Set(prev).add(petId));
        try {
            await togglePetFeature(petId).unwrap();
        } finally {
            setTogglingIds((prev) => {
                const next = new Set(prev);
                next.delete(petId);
                return next;
            });
        }
    }, [togglePetFeature]);

    const handleDelete = useCallback((petId) => {
        const pet = pets.find((p) => p._id === petId);
        setDeleteConfirm({
            petId,
            petName: pet?.name || 'Unknown',
        });
    }, [pets]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteConfirm) return;
        const { petId } = deleteConfirm;
        setDeletingIds((prev) => new Set(prev).add(petId));
        try {
            await deletePet(petId).unwrap();
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(petId);
                return next;
            });
            setDeleteConfirm(null);
        }
    }, [deleteConfirm, deletePet]);

    const handleView = useCallback((petId) => {
        navigate(build.petDetail(petId));
    }, [navigate]);

    const renderRow = useCallback(
        (pet, index) => (
            <PetRow
                key={pet._id}
                pet={pet}
                index={index}
                onFeature={handleFeature}
                onDelete={handleDelete}
                onView={handleView}
                isTogglingFeature={togglingIds.has(pet._id)}
                isDeleting={deletingIds.has(pet._id)}
            />
        ),
        [handleFeature, handleDelete, handleView, togglingIds, deletingIds]
    );

    const hasFilters = debouncedSearch || speciesFilter || statusFilter;
    const isEmpty = !isLoading && !isError && pets.length === 0;

    return (
        <>
            <SEO title="Manage Pets | Admin" noindex />

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Pet Listing"
                message={`Are you sure you want to delete "${deleteConfirm?.petName}"? This action will set the listing to inactive/removed.`}
                confirmLabel="Delete Listing"
                variant="danger"
                isLoading={false}
            />

            <motion.div className="space-y-6 pb-10" initial="initial" animate="animate">
                {/* Header Banner */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    variants={fadeUp}
                >
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                            Pet Listings Management
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                            Review, feature, inspect, and remove pet listings across the platform
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={refetch}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm self-start"
                    >
                        <FiRefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                        <span>Refresh</span>
                    </button>
                </motion.div>

                {/* Filter Controls Bar */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3"
                    variants={fadeUp}
                >
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search pets by name, breed..."
                            isLoading={isFetching}
                        />
                    </div>
                    <Select
                        value={speciesFilter}
                        onChange={handleSpeciesChange}
                        options={speciesOptions}
                        className="sm:w-44"
                    />
                    <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        options={statusOptions}
                        className="sm:w-40"
                    />
                </motion.div>

                {/* Error State */}
                {!isLoading && isError && (
                    <motion.div
                        className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-3xl p-8 text-center"
                        variants={fadeUp}
                    >
                        <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-red-900 dark:text-red-300 mb-1">
                            Failed to Fetch Pet Listings
                        </h3>
                        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                            {error?.data?.message || error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button type="button" onClick={refetch} className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl">
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {isEmpty && (
                    <motion.div
                        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-12 text-center shadow-soft"
                        variants={fadeUp}
                    >
                        <FiHeart className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100 mb-1">
                            {hasFilters ? 'No Matching Pets Found' : 'No Pet Listings Registered'}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {hasFilters
                                ? 'Try clearing your search query or adjusting your species/status filters.'
                                : 'Pet listings will appear here once pet parents create them.'}
                        </p>
                    </motion.div>
                )}

                {/* Pets Table */}
                {!isError && !isEmpty && (
                    <motion.div variants={fadeUp} className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={pets}
                            isLoading={isLoading}
                            isError={false}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            renderRow={renderRow}
                            rowKey="_id"
                        />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default AdminPetsPage;