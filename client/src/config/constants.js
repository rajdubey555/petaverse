const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'PetVerse';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

const LISTING_TYPES = ['adoption', 'rehoming', 'sale', 'lost', 'found'];

const LISTING_STATUSES = ['available', 'adopted', 'rehomed', 'sold', 'pending'];

const SPECIES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'];

const SPECIES_CONFIG = {
    dog: { label: 'Dog', icon: '🐕' },
    cat: { label: 'Cat', icon: '🐈' },
    bird: { label: 'Bird', icon: '🐦' },
    fish: { label: 'Fish', icon: '🐟' },
    rabbit: { label: 'Rabbit', icon: '🐰' },
    hamster: { label: 'Hamster', icon: '🐹' },
    reptile: { label: 'Reptile', icon: '🦎' },
    other: { label: 'Other', icon: '🐾' },
};

const GENDERS = ['male', 'female', 'unknown'];

const SIZES = ['small', 'medium', 'large', 'xlarge'];

const AGE_UNITS = ['days', 'weeks', 'months', 'years'];

const REPORT_REASONS = [
    'inappropriate_content',
    'spam',
    'misleading_information',
    'duplicate_listing',
    'sold_or_adopted',
    'harmful_or_dangerous',
    'other',
];

const REPORT_STATUSES = ['pending', 'reviewed', 'resolved', 'dismissed'];

const CONTACT_METHODS = ['email', 'phone', 'both'];

const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
};

const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
};

const TOKEN = {
    ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes in seconds
    REFRESH_THRESHOLD: 60, // Refresh if less than 60s remaining
};

const UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 6,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    MAX_DIMENSION: 4000,
};

const SORT_OPTIONS = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'createdAt', label: 'Oldest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-viewCount', label: 'Most Viewed' },
];

export {
    API_BASE_URL,
    APP_NAME,
    GOOGLE_CLIENT_ID,
    APP_ENV,
    LISTING_TYPES,
    LISTING_STATUSES,
    SPECIES,
    SPECIES_CONFIG,
    GENDERS,
    SIZES,
    AGE_UNITS,
    REPORT_REASONS,
    REPORT_STATUSES,
    CONTACT_METHODS,
    ROLES,
    PAGINATION,
    TOKEN,
    UPLOAD,
    SORT_OPTIONS,
};