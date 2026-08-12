/**
 * Application Routes Configuration
 * Supports both pattern strings and dynamic helper functions.
 */

const createRoutePath = (pattern, buildFn) => {
    const fn = (id) => (id ? buildFn(id) : pattern);
    fn.toString = () => pattern;
    fn.valueOf = () => pattern;
    return fn;
};

const build = {
    petDetail: (id) => `/pets/${id}`,
    petEdit: (id) => `/pets/${id}/edit`,
    profile: (id) => `/profile/${id}`,
    chat: (conversationId) => `/chat/${conversationId}`,
    communityPost: (postId) => `/community/${postId}`,
};

const ROUTES = {
    HOME: '/',
    PETS: {
        BROWSE: '/pets',
        CREATE: '/pets/new',
        LOST_FOUND: '/lost-found',
    },

    // Aliases kept for backward compatibility with other pages
    BROWSE_PETS: '/pets',
    PET_DETAIL: createRoutePath('/pets/:id', (id) => `/pets/${id}`),
    PET_CREATE: '/pets/new',
    CREATE_LISTING: '/pets/new',
    PET_EDIT: createRoutePath('/pets/:id/edit', (id) => `/pets/${id}/edit`),
    EDIT_PET: createRoutePath('/pets/:id/edit', (id) => `/pets/${id}/edit`),
    LOST_FOUND: '/lost-found',
    LOGIN: '/login',
    REGISTER: '/register',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    PROFILE: createRoutePath('/profile/:id', (id) => `/profile/${id}`),
    SAVED: '/saved',
    SAVED_PETS: '/saved',
    MY_LISTINGS: '/my-listings',
    SETTINGS: '/settings',
    MY_REPORTS: '/reports',
    CHAT: '/chat',
    NOTIFICATIONS: '/notifications',
    COMMUNITY: '/community',
    REVIEWS: '/reviews',
    ADMIN: {
        DASHBOARD: '/admin',
        USERS: '/admin/users',
        PETS: '/admin/pets',
        REPORTS: '/admin/reports',
    },
    build,
};

export { ROUTES, build };
export default ROUTES;