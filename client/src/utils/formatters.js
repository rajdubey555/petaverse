/**
 * Formatters — Utility functions for formatting data for display.
 */

/**
 * Format a date string or Date object into a readable format.
 * @param {string|Date} date - The date to format
 * @param {object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return 'N/A';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    try {
        return new Intl.DateTimeFormat('en-US', {
            ...defaultOptions,
            ...options,
        }).format(new Date(date));
    } catch {
        return 'Invalid Date';
    }
};

/**
 * Format a date with time.
 * @param {string|Date} date
 * @returns {string} Formatted date + time string (e.g., "Jan 15, 2025 at 3:30 PM")
 */
export const formatDateTime = (date) => {
    if (!date) return 'N/A';

    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(date));
    } catch {
        return 'Invalid Date';
    }
};

/**
 * Format a relative time string (e.g., "2 days ago", "just now").
 * @param {string|Date} date
 * @returns {string} Relative time
 */
export const formatRelativeTime = (date) => {
    if (!date) return 'N/A';

    const now = Date.now();
    const then = new Date(date).getTime();
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin === 1) return '1 minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr === 1) return '1 hour ago';
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    if (diffYears === 1) return '1 year ago';
    return `${diffYears} years ago`;
};

/**
 * Format a price value as currency.
 * @param {number} price - Price value
 * @param {string} [currency='INR'] - Currency code
 * @returns {string} Formatted price (e.g., "₹5,000")
 */
export const formatPrice = (price, currency = 'INR') => {
    if (price == null || isNaN(price)) return 'Free';

    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    } catch {
        return `₹${price.toLocaleString('en-IN')}`;
    }
};

/**
 * Format an age value into a readable string.
 * @param {number} value - The age numeric value
 * @param {string} unit - The age unit (days, weeks, months, years)
 * @returns {string} Formatted age (e.g., "2 years old", "3 months")
 */
export const formatAge = (value, unit) => {
    if (value == null) return 'Unknown age';
    const normalizedUnit = unit?.toLowerCase() || 'years';
    const unitMap = {
        days: value === 1 ? '1 day old' : `${value} days old`,
        weeks: value === 1 ? '1 week old' : `${value} weeks old`,
        months: value === 1 ? '1 month old' : `${value} months old`,
        years: value === 1 ? '1 year old' : `${value} years old`,
    };
    return unitMap[normalizedUnit] || `${value} ${normalizedUnit}`;
};

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text - Input text
 * @param {number} [maxLength=100] - Maximum characters
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
};

/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string} (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format a count number with abbreviations for large numbers.
 * @param {number} count
 * @returns {string} (e.g., "1.2K", "3.5M")
 */
export const formatCount = (count) => {
    if (count == null) return '0';
    if (count < 1000) return count.toString();
    if (count < 1_000_000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
};