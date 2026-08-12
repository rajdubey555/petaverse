import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import cn from '../../utils/cn';
import Button from './Button';

/**
 * Pagination — Reusable pagination component for listing pages.
 * Follows the PetVerse Design System pagination patterns.
 *
 * Features:
 * - Page number buttons with active state
 * - Previous/Next navigation
 * - Ellipsis for large page ranges
 * - Configurable sibling count (pages visible on each side of current)
 * - First/Last page shortcuts (optional)
 * - Page size selector (optional)
 * - Results summary text ("Showing 1-12 of 120 results")
 * - Mobile-optimized: reduced buttons on small screens
 * - Accessible: aria-current="page", aria-label on all buttons
 *
 * Props:
 * - currentPage: Current active page (1-based)
 * - totalPages: Total number of pages
 * - onPageChange: Callback with new page number
 * - totalItems: Total number of items (for summary text)
 * - pageSize: Items per page (for summary text)
 * - siblingCount: Number of page buttons on each side of current (default: 1)
 * - showFirstLast: Show "First" and "Last" buttons (default: false)
 * - showSummary: Show "Showing X-Y of Z results" text (default: true)
 * - pageSizeOptions: Array of page size options (e.g., [12, 24, 48])
 * - onPageSizeChange: Callback when page size changes
 * - size: 'sm' | 'md' (default: 'md')
 * - className: Additional wrapper classes
 * - disabled: Disable all interactions
 */

const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
};

const generatePageNumbers = (currentPage, totalPages, siblingCount = 1) => {
    // Total page buttons to show: siblingCount + first + last + current + 2 ellipsis
    const totalPageNumbers = siblingCount * 2 + 5;

    // If total pages is less than what we want to show, show all
    if (totalPages <= totalPageNumbers) {
        return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = range(1, leftItemCount);
        return [...leftRange, '...', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = range(totalPages - rightItemCount + 1, totalPages);
        return [1, '...', ...rightRange];
    }

    // Both ellipses
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, '...', ...middleRange, '...', totalPages];
};

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems,
    pageSize,
    siblingCount = 1,
    showFirstLast = false,
    showSummary = true,
    pageSizeOptions,
    onPageSizeChange,
    size = 'md',
    className,
    disabled = false,
}) => {
    if (totalPages <= 1 && !showSummary) return null;

    const pages = generatePageNumbers(currentPage, totalPages, siblingCount);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePageChange = (page) => {
        if (page === '...' || disabled) return;
        const pageNum = Number(page);
        if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
            onPageChange?.(pageNum);
        }
    };

    // Results summary
    const startItem = totalItems ? (currentPage - 1) * (pageSize || 10) + 1 : null;
    const endItem = totalItems ? Math.min(currentPage * (pageSize || 10), totalItems) : null;

    const buttonSize = size === 'sm' ? 'xs' : 'sm';
    const pageButtonBase =
        'min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200';

    return (
        <nav
            className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
            aria-label="Pagination"
        >
            {/* Results Summary */}
            {showSummary && totalItems != null && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 order-2 sm:order-1">
                    {totalItems > 0 ? (
                        <>
                            Showing{' '}
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {startItem}-{endItem}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {totalItems}
                            </span>{' '}
                            results
                        </>
                    ) : (
                        'No results found'
                    )}
                </p>
            )}

            <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* Page Size Selector */}
                {pageSizeOptions && onPageSizeChange && pageSize && (
                    <div className="hidden sm:flex items-center gap-2 mr-2">
                        <label className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                            Show:
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            disabled={disabled}
                            className="text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* First Page */}
                {showFirstLast && (
                    <button
                        type="button"
                        onClick={() => handlePageChange(1)}
                        disabled={isFirstPage || disabled}
                        className={cn(
                            pageButtonBase,
                            'hidden sm:flex',
                            isFirstPage || disabled
                                ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        )}
                        aria-label="Go to first page"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                        <FiChevronLeft className="w-4 h-4 -ml-2" />
                    </button>
                )}

                {/* Previous */}
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={isFirstPage || disabled}
                    className={cn(
                        pageButtonBase,
                        'gap-1',
                        isFirstPage || disabled
                            ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                    aria-label="Go to previous page"
                >
                    <FiChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Prev</span>
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                    {pages.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className={cn(
                                        pageButtonBase,
                                        'text-neutral-400 dark:text-neutral-600 cursor-default'
                                    )}
                                    aria-hidden="true"
                                >
                                    <FiMoreHorizontal className="w-4 h-4" />
                                </span>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                disabled={disabled}
                                className={cn(
                                    pageButtonBase,
                                    isActive
                                        ? 'bg-primary-500 text-white shadow-sm'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                    disabled && 'cursor-not-allowed opacity-50'
                                )}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile page indicator */}
                <span className="sm:hidden text-sm font-medium text-neutral-700 dark:text-neutral-300 px-2">
                    {currentPage} / {totalPages}
                </span>

                {/* Next */}
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={isLastPage || disabled}
                    className={cn(
                        pageButtonBase,
                        'gap-1',
                        isLastPage || disabled
                            ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                    aria-label="Go to next page"
                >
                    <span className="hidden sm:inline text-xs">Next</span>
                    <FiChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                {showFirstLast && (
                    <button
                        type="button"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={isLastPage || disabled}
                        className={cn(
                            pageButtonBase,
                            'hidden sm:flex',
                            isLastPage || disabled
                                ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        )}
                        aria-label="Go to last page"
                    >
                        <FiChevronRight className="w-4 h-4" />
                        <FiChevronRight className="w-4 h-4 -ml-2" />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Pagination;