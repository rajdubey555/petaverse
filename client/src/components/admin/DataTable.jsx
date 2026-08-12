import { memo } from 'react';
import { FiChevronUp, FiChevronDown, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';

const sortIcons = {
    asc: FiChevronUp,
    desc: FiChevronDown,
};

const DataTable = ({
    columns = [],
    data = [],
    isLoading = false,
    isError = false,
    error = null,
    onRetry = null,
    sortBy = null,
    sortOrder = 'asc',
    onSort = null,
    pagination = null,
    onPageChange = null,
    emptyState = null,
    rowKey = '_id',
    renderRow,
    stickyHeader = true,
    hoverable = true,
    className,
    ...props
}) => {
    const handleSort = (column) => {
        if (!column.sortable || !onSort) return;
        const newOrder = sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
        onSort(column.key, newOrder);
    };

    return (
        <div className={cn('space-y-4', className)} {...props}>
            {/* Table Container */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        {/* Header */}
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                                {columns.map((col) => {
                                    const isActive = sortBy === col.key;
                                    const SortIcon = sortIcons[sortOrder] || FiChevronDown;

                                    return (
                                        <th
                                            key={col.key}
                                            className={cn(
                                                'px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap',
                                                col.sortable && 'cursor-pointer select-none hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors',
                                                stickyHeader && 'sticky top-0 bg-neutral-50 dark:bg-neutral-800/50',
                                                col.className
                                            )}
                                            onClick={() => handleSort(col)}
                                            style={col.width ? { width: col.width } : undefined}
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {col.label}
                                                {col.sortable && (
                                                    <SortIcon
                                                        className={cn(
                                                            'w-3.5 h-3.5 transition-opacity',
                                                            isActive ? 'opacity-100 text-primary-500' : 'opacity-30'
                                                        )}
                                                    />
                                                )}
                                            </span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                            {/* Loading State */}
                            {isLoading && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-16">
                                        <div className="flex items-center justify-center">
                                            <Spinner size="lg" variant="primary" />
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Error State */}
                            {!isLoading && isError && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-16">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {error || 'Failed to load data.'}
                                            </p>
                                            {onRetry && (
                                                <button
                                                    type="button"
                                                    onClick={onRetry}
                                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                                                >
                                                    Try Again
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Empty State */}
                            {!isLoading && !isError && data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-16">
                                        {emptyState || (
                                            <EmptyState
                                                variant="no-results"
                                                size="sm"
                                                message="No data found."
                                            />
                                        )}
                                    </td>
                                </tr>
                            )}

                            {/* Data Rows */}
                            {!isLoading &&
                                !isError &&
                                data.length > 0 &&
                                data.map((item, index) => renderRow(item, index))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && onPageChange && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(DataTable);