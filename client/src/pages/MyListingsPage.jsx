import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiGrid,
    FiAlertCircle,
    FiSearch,
    FiFilter,
} from 'react-icons/fi';
import { useGetPetsQuery, useDeletePetMutation } from '../store/api/petApi';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';
import { PAGINATION, LISTING_TYPES, SPECIES_CONFIG } from '../config/constants';
import { formatDate, formatPrice, formatRelativeTime } from '../utils/formatters';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LazyImage from '../components/common/LazyImage';
import ListingTypeBadge from '../components/pet/ListingTypeBadge';
import SearchBar from '../components/common/SearchBar';
import Select from '../components/common/Select';
import { useDebounce } from '../hooks/useDebounce';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } },
};

const statusBadgeVariant = {
    available: 'success',
    adopted: 'info',
    pending: 'warning',
    removed: 'danger',
};

const listingSortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-viewCount', label: 'Most Viewed' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
];

const MyListingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [deletePetName, setDeletePetName] = useState('');

    const debouncedSearch = useDebounce(search, 400);

    const userId = user?._id || user?.id;

    const queryParams = useMemo(() => {
        if (!userId) return {};
        const params = {
            page,
            limit: PAGINATION.DEFAULT_LIMIT,
            sort,
            owner: userId,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter) params.status = statusFilter;
        return params;
    }, [page, sort, debouncedSearch, statusFilter, userId]);

    const { data, isLoading, isFetching, error } = useGetPetsQuery(queryParams, {
        skip: !userId,
    });
    const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();

    const listings = data?.data || [];
    const pagination = data?.pagination;

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePet(deleteId).unwrap();
            setDeleteId(null);
            setDeletePetName('');
        } catch {
            // Error handled by toast middleware
        }
    };

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'available', label: 'Available' },
        { value: 'adopted', label: 'Adopted' },
        { value: 'pending', label: 'Pending' },
        { value: 'removed', label: 'Removed' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                        My Listings
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        Manage your pet listings
                    </p>
                </div>
                <Link to={ROUTES.CREATE_LISTING}>
                    <Button>
                        <FiPlus className="w-4 h-4" />
                        Add New Listing
                    </Button>
                </Link>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 mb-6"
            >
                <div className="flex-1">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search your listings..."
                    />
                </div>
                <div className="flex gap-3">
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                        className="w-40"
                    />
                    <Select
                        value={sort}
                        onChange={setSort}
                        options={listingSortOptions}
                        className="w-44"
                    />
                </div>
            </motion.div>

            {/* Content */}
            {error ? (
                <EmptyState
                    icon={FiAlertCircle}
                    title="Failed to Load Listings"
                    description="Something went wrong while loading your listings."
                    action={{
                        label: 'Try Again',
                        onClick: () => window.location.reload(),
                    }}
                />
            ) : isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} padding="md" className="animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <EmptyState
                    icon={FiGrid}
                    title="No Listings Found"
                    description={
                        search || statusFilter
                            ? 'No listings match your current filters. Try adjusting them.'
                            : "You haven't created any pet listings yet."
                    }
                    action={
                        !search && !statusFilter
                            ? {
                                label: 'Create Your First Listing',
                                onClick: () => navigate(ROUTES.CREATE_LISTING),
                            }
                            : {
                                label: 'Clear Filters',
                                onClick: () => {
                                    setSearch('');
                                    setStatusFilter('');
                                },
                            }
                    }
                />
            ) : (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {listings.map((pet) => (
                                <motion.div
                                    key={pet._id}
                                    variants={fadeUp}
                                    exit={{ opacity: 0, x: -20 }}
                                    layout
                                >
                                    <Card
                                        padding="md"
                                        hover
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Image */}
                                            <Link
                                                to={ROUTES.PET_DETAIL(pet._id)}
                                                className="flex-shrink-0 w-full sm:w-32 h-40 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700"
                                            >
                                                <LazyImage
                                                    src={pet.images?.[0]?.url || '/placeholder-pet.svg'}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <Link
                                                            to={ROUTES.PET_DETAIL(pet._id)}
                                                            className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                                        >
                                                            {pet.name}
                                                        </Link>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <ListingTypeBadge type={pet.listingType} size="sm" />
                                                            <Badge
                                                                variant={statusBadgeVariant[pet.status] || 'default'}
                                                                size="sm"
                                                            >
                                                                {pet.status}
                                                            </Badge>
                                                            {pet.isFeatured && (
                                                                <Badge variant="primary" size="sm" dot>
                                                                    Featured
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                    <span>{pet.breed || SPECIES_CONFIG[pet.species]?.label || pet.species}</span>
                                                    {pet.price && (
                                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                            {formatPrice(pet.price)}
                                                        </span>
                                                    )}
                                                    <span>{pet.viewCount || 0} views</span>
                                                    <span>Posted {formatRelativeTime(pet.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-2 sm:justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(ROUTES.PET_DETAIL(pet._id))}
                                                    title="View"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(ROUTES.EDIT_PET(pet._id))}
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setDeleteId(pet._id);
                                                        setDeletePetName(pet.name);
                                                    }}
                                                    title="Delete"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={isFetching}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => {
                    setDeleteId(null);
                    setDeletePetName('');
                }}
                onConfirm={handleDelete}
                title="Delete Listing"
                message={`Are you sure you want to delete "${deletePetName}"? This action cannot be undone.`}
                variant="danger"
                confirmLabel="Delete"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default MyListingsPage;