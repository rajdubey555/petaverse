import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import PetCard from './PetCard';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import CardSkeleton from '../skeleton/CardSkeleton';
import { PAGINATION } from '../../config/constants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const PetGrid = ({
    pets = [],
    isLoading = false,
    isError = false,
    error = null,
    onRetry,
    // Pagination
    pagination,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    // Save
    savedPetIds = new Set(),
    onSaveToggle,
    // Layout
    columns = { sm: 1, md: 2, lg: 3, xl: 4 },
    gap = 'md',
    className,
    // Empty state
    emptyTitle = 'No Pets Found',
    emptyDescription = 'There are no pets matching your criteria. Try adjusting your filters or check back later.',
    emptyIcon = 'search',
    // Skeleton
    skeletonCount = 8,
    // Extra
    showPagination = true,
    ...props
}) => {
    const gridCols = useMemo(() => {
        return cn(
            columns.sm && `grid-cols-${columns.sm}`,
            columns.md && `md:grid-cols-${columns.md}`,
            columns.lg && `lg:grid-cols-${columns.lg}`,
            columns.xl && `xl:grid-cols-${columns.xl}`
        );
    }, [columns]);

    const gapClasses = {
        sm: 'gap-3',
        md: 'gap-4',
        lg: 'gap-6',
    };

    const paginationData = pagination || {
        page: currentPage,
        totalPages,
        totalItems,
    };

    // Loading State
    if (isLoading) {
        return (
            <div className={cn('space-y-6', className)} {...props}>
                <div
                    className={cn(
                        'grid',
                        gridCols || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                        gapClasses[gap] || gapClasses.md
                    )}
                >
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className={cn(className)} {...props}>
                <EmptyState
                    icon="error"
                    title="Failed to Load Pets"
                    description={error || 'Something went wrong while loading pets. Please try again.'}
                    action={
                        onRetry
                            ? {
                                label: 'Try Again',
                                onClick: onRetry,
                            }
                            : undefined
                    }
                />
            </div>
        );
    }

    // Empty State
    if (!pets || pets.length === 0) {
        return (
            <div className={cn(className)} {...props}>
                <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                />
            </div>
        );
    }

    return (
        <div className={cn('space-y-6', className)} {...props}>
            {/* Results Summary */}
            {totalItems > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Showing{' '}
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {pets.length}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {totalItems}
                        </span>{' '}
                        {totalItems === 1 ? 'pet' : 'pets'}
                    </p>
                </div>
            )}

            {/* Pet Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                    'grid',
                    gridCols || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                    gapClasses[gap] || gapClasses.md
                )}
            >
                <AnimatePresence mode="popLayout">
                    {pets.map((pet, index) => (
                        <PetCard
                            key={pet._id || pet.id || index}
                            pet={pet}
                            isSaved={
                                savedPetIds instanceof Set
                                    ? savedPetIds.has(pet._id || pet.id)
                                    : false
                            }
                            onSaveToggle={onSaveToggle}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {showPagination && paginationData.totalPages > 1 && (
                <Pagination
                    currentPage={paginationData.page || currentPage}
                    totalPages={paginationData.totalPages || totalPages}
                    onPageChange={onPageChange}
                    showSummary
                    showPageSize
                    siblingCount={1}
                />
            )}
        </div>
    );
};

export default memo(PetGrid);