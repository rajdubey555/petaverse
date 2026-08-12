# PetVerse Frontend Foundation — Implementation Plan

> **Based on:** [frontend-architecture.md](plans/frontend-architecture.md)
> **Tech Stack:** React 18, Vite, Tailwind CSS, Redux Toolkit, RTK Query, React Router DOM v6, React Hook Form, Framer Motion, React Icons
> **Base Directory:** `client/`

---

## File Creation Order (dependency-based)

### Phase 1: Project Skeleton (Foundation)
| # | File | Purpose |
|---|------|---------|
| 1 | `client/package.json` | Dependencies, scripts, engines |
| 2 | `client/vite.config.js` | Dev server proxy, path aliases, build config |
| 3 | `client/tailwind.config.js` | Content paths, theme extensions |
| 4 | `client/postcss.config.js` | PostCSS plugins (tailwind, autoprefixer) |
| 5 | `client/.env.example` | VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID |
| 6 | `client/.env` | Local dev variables |
| 7 | `client/.gitignore` | Node modules, dist, env |
| 8 | `client/index.html` | Root HTML with Google Fonts + meta tags |
| 9 | `client/public/favicon.svg` | PawPrint icon placeholder |
| 10 | `client/public/robots.txt` | Allow all |

### Phase 2: Config Layer
| # | File | Purpose |
|---|------|---------|
| 11 | `client/src/config/constants.js` | API_BASE_URL, APP_NAME, GOOGLE_CLIENT_ID, species/sizes/listingTypes enums, pagination defaults |
| 12 | `client/src/config/routes.js` | ROUTES path constants + build() URL helpers |
| 13 | `client/src/config/tailwind.js` | Custom Tailwind theme extensions (colors, fonts, shadows) |

### Phase 3: Redux Store Layer
| # | File | Purpose |
|---|------|---------|
| 14 | `client/src/store/slices/authSlice.js` | user, accessToken, isAuthenticated, isLoading |
| 15 | `client/src/store/slices/uiSlice.js` | theme, mobileMenuOpen, filterDrawerOpen, globalLoading, adminSidebarCollapsed |
| 16 | `client/src/store/slices/filterSlice.js` | search, species[], listingType[], size[], gender[], sort, page, limit |
| 17 | `client/src/store/slices/toastSlice.js` | toasts[] + addToast/removeToast/clearToasts |
| 18 | `client/src/store/api/baseApi.js` | createApi + fetchBaseQuery + baseQueryWithReauth + tagTypes |
| 19 | `client/src/store/api/authApi.js` | googleLogin, refreshToken, logout, getCurrentUser |
| 20 | `client/src/store/api/petApi.js` | getPets, getPetById, getFeaturedPets, getSuggestions, createPet, updatePet, deletePet, incrementView |
| 21 | `client/src/store/api/userApi.js` | getPublicProfile, getUserListings, updateProfile, deleteAccount |
| 22 | `client/src/store/api/savedPetApi.js` | toggleSave, getSavedPets, checkSaved, unsavePet |
| 23 | `client/src/store/api/reportApi.js` | createReport, getMyReports, deleteReport |
| 24 | `client/src/store/api/uploadApi.js` | uploadSingle, uploadMultiple, deleteImage |
| 25 | `client/src/store/api/adminApi.js` | getDashboard, getUsers, getAdminPets, getAdminReports, toggleUserStatus, togglePetFeature |
| 26 | `client/src/store/index.js` | configureStore + toast middleware + combine reducers |

### Phase 4: Hooks Layer
| # | File | Purpose |
|---|------|---------|
| 27 | `client/src/hooks/useAuth.js` | Login/logout flows, Google OAuth callback |
| 28 | `client/src/hooks/useDebounce.js` | Debounced value (search input) |
| 29 | `client/src/hooks/useMediaQuery.js` | Responsive breakpoint detection |
| 30 | `client/src/hooks/useScrollToTop.js` | Scroll reset on route change |

### Phase 5: Utility Layer
| # | File | Purpose |
|---|------|---------|
| 31 | `client/src/utils/cn.js` | clsx + tailwind-merge |
| 32 | `client/src/utils/formatters.js` | formatDate, formatPrice, formatAge, truncateText, formatRelativeTime |
| 33 | `client/src/utils/validators.js` | isEmail, isPhone, minLength, maxLength helpers |
| 34 | `client/src/utils/storage.js` | localStorage get/set/remove with JSON safety |
| 35 | `client/src/utils/errorUtils.js` | extractErrorMessage, isNetworkError, isAuthError, isServerError |

### Phase 6: Common Components (only what's needed for foundation)
| # | File | Purpose |
|---|------|---------|
| 36 | `client/src/components/common/Spinner.jsx` | Full-page and inline spinner variants |
| 37 | `client/src/components/common/Toast.jsx` | Single toast with icon + message + dismiss |
| 38 | `client/src/components/common/ToastContainer.jsx` | Fixed bottom-right stack with AnimatePresence |
| 39 | `client/src/components/common/ErrorFallback.jsx` | Error boundary UI: icon + message + retry/refresh |
| 40 | `client/src/components/common/ErrorBoundary.jsx` | Class component with getDerivedStateFromError |

### Phase 7: Layout Components
| # | File | Purpose |
|---|------|---------|
| 41 | `client/src/components/layout/Header.jsx` | Logo + NavLinks + SearchBar placeholder + UserMenu |
| 42 | `client/src/components/layout/Footer.jsx` | About, Contact, Privacy, Terms, Social Links, Copyright |
| 43 | `client/src/components/layout/MobileNav.jsx` | Bottom tab bar: Home, Browse, Saved, Profile |
| 44 | `client/src/components/layout/UserMenu.jsx` | Avatar dropdown: Profile, My Listings, Saved, Settings, Logout |
| 45 | `client/src/components/layout/MainLayout.jsx` | Header + Outlet (scroll-to-top) + Footer + MobileNav |
| 46 | `client/src/components/layout/AdminSidebar.jsx` | Collapsible: Dashboard, Users, Pets, Reports |
| 47 | `client/src/components/layout/AdminHeader.jsx` | Breadcrumb + admin name + logout |
| 48 | `client/src/components/layout/AdminLayout.jsx` | AdminSidebar + AdminHeader + Outlet |

### Phase 8: Route Guards
| # | File | Purpose |
|---|------|---------|
| 49 | `client/src/router/ProtectedRoute.jsx` | Auth gate — checks isAuthenticated, redirect to /login |
| 50 | `client/src/router/AdminRoute.jsx` | Auth + role=admin gate |
| 51 | `client/src/router/GuestRoute.jsx` | Redirects authenticated users away from /login, /register |

### Phase 9: Page Placeholders (empty shells, no UI)
| # | File | Purpose |
|---|------|---------|
| 52 | `client/src/pages/HomePage.jsx` | Placeholder |
| 53 | `client/src/pages/BrowsePetsPage.jsx` | Placeholder |
| 54 | `client/src/pages/PetDetailPage.jsx` | Placeholder |
| 55 | `client/src/pages/LostFoundPage.jsx` | Placeholder |
| 56 | `client/src/pages/LoginPage.jsx` | Placeholder |
| 57 | `client/src/pages/RegisterPage.jsx` | Placeholder |
| 58 | `client/src/pages/AboutUsPage.jsx` | Placeholder |
| 59 | `client/src/pages/ContactUsPage.jsx` | Placeholder |
| 60 | `client/src/pages/PrivacyPolicyPage.jsx` | Placeholder |
| 61 | `client/src/pages/TermsConditionsPage.jsx` | Placeholder |
| 62 | `client/src/pages/ProfilePage.jsx` | Placeholder |
| 63 | `client/src/pages/MyListingsPage.jsx` | Placeholder |
| 64 | `client/src/pages/SavedPetsPage.jsx` | Placeholder |
| 65 | `client/src/pages/SettingsPage.jsx` | Placeholder |
| 66 | `client/src/pages/NotFoundPage.jsx` | Placeholder (404) |
| 67 | `client/src/pages/admin/AdminDashboardPage.jsx` | Placeholder |
| 68 | `client/src/pages/admin/AdminUsersPage.jsx` | Placeholder |
| 69 | `client/src/pages/admin/AdminPetsPage.jsx` | Placeholder |
| 70 | `client/src/pages/admin/AdminReportsPage.jsx` | Placeholder |
| 71 | `client/src/pages/ChatPage.jsx` | Future placeholder |
| 72 | `client/src/pages/NotificationsPage.jsx` | Future placeholder |
| 73 | `client/src/pages/CommunityPage.jsx` | Future placeholder |
| 74 | `client/src/pages/ReviewsPage.jsx` | Future placeholder |

### Phase 10: Entry Points
| # | File | Purpose |
|---|------|---------|
| 75 | `client/src/router/AppRouter.jsx` | createBrowserRouter with full route tree |
| 76 | `client/src/App.jsx` | Root layout shell (Outlet-based) with ErrorBoundary |
| 77 | `client/src/main.jsx` | Vite entry: Provider + RouterProvider + ToastContainer + HelmetProvider |
| 78 | `client/src/index.css` | Tailwind directives + custom utilities |

---

## Key Architecture Decisions

### 1. package.json Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "framer-motion": "^10.16.0",
  "react-icons": "^4.12.0",
  "@react-oauth/google": "^0.12.0",
  "react-helmet-async": "^2.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

### 2. Vite Configuration
- Dev server on port 5173
- Proxy `/api` to `http://localhost:5000` (backend)
- Path alias `@` → `./src`
- Build output: `dist/`
- React plugin with Fast Refresh

### 3. Redux Store Middleware Pipeline
```
getDefaultMiddleware() → baseApi.middleware → toastMiddleware
```

### 4. RTK Query baseApi
- `baseUrl`: from `import.meta.env.VITE_API_BASE_URL`
- `credentials: 'include'` for httpOnly refresh cookie
- `prepareHeaders`: attach Bearer token from authSlice
- `baseQueryWithReauth`: 401 interceptor → refresh → retry
- `tagTypes`: Pet, User, SavedPet, Report, AdminUser, AdminPet, AdminReport, Dashboard

### 5. Route Structure
```
AppRouter
├── MainLayout
│   ├── / → HomePage
│   ├── /pets → BrowsePetsPage
│   ├── /pets/:id → PetDetailPage
│   ├── /lost-found → LostFoundPage
│   ├── /about → AboutUsPage
│   ├── /contact → ContactUsPage
│   ├── /privacy → PrivacyPolicyPage
│   ├── /terms → TermsConditionsPage
│   ├── GuestRoute
│   │   ├── /login → LoginPage
│   │   └── /register → RegisterPage
│   ├── ProtectedRoute
│   │   ├── /pets/new → CreateListingPage (future)
│   │   ├── /pets/:id/edit → EditListingPage (future)
│   │   ├── /saved → SavedPetsPage
│   │   ├── /my-listings → MyListingsPage
│   │   ├── /settings → SettingsPage
│   │   └── /profile → ProfilePage (self)
│   ├── /profile/:id → ProfilePage (public)
│   └── * → NotFoundPage
├── AdminLayout
│   └── AdminRoute
│       ├── /admin → AdminDashboardPage
│       ├── /admin/users → AdminUsersPage
│       ├── /admin/pets → AdminPetsPage
│       └── /admin/reports → AdminReportsPage
├── /chat → ChatPage (future)
├── /notifications → NotificationsPage (future)
├── /community → CommunityPage (future)
└── /reviews → ReviewsPage (future)
```

### 6. Toast System
- `toastSlice`: toasts[] array, addToast({type, message, duration?}), removeToast(id)
- `ToastContainer`: Fixed bottom-right, AnimatePresence, z-50
- `toastMiddleware`: Auto-dispatch success/error toasts on RTKQ fulfilled/rejected actions
- Types: success (4s), error (6s), warning (5s), info (4s)

### 7. Layout Architecture
- `MainLayout`: flex min-h-screen → Header (sticky) + main (flex-1, Outlet) + Footer + MobileNav (fixed bottom, md:hidden)
- `AdminLayout`: flex h-screen → AdminSidebar (collapsible) + right-side (AdminHeader + Outlet)
- Scroll-to-top on route change via `useScrollToTop()` hook in MainLayout

### 8. Footer Content
- 4-column grid (desktop): About section, Quick Links, Contact Info, Social Links
- Bottom bar: Copyright + Terms + Privacy
- Social: Facebook, Twitter/X, Instagram, GitHub (icons via react-icons)
- Responsive: stacks on mobile

### 9. Error Boundary Strategy
- Root ErrorBoundary in App.jsx (catches all)
- Each layout has its own ErrorBoundary (catches layout-specific)
- `ErrorFallback`: icon + message + Retry button (+ Refresh button at root level)
- Page placeholders are simple: they won't trigger errors, but the boundary is in place

---

## Files NOT Being Created (deferred to page/component implementation phase)

- `src/components/common/Button.jsx`, `Input.jsx`, `Select.jsx`, `Modal.jsx`, `Card.jsx`, `Badge.jsx`, `EmptyState.jsx`, `ConfirmDialog.jsx`, `ImageUploader.jsx`, `SearchBar.jsx`, `Pagination.jsx`, `FilterPanel.jsx`, `FilterChips.jsx`, `Skeleton.jsx`, `SEO.jsx`, `LazyImage.jsx`
- `src/components/auth/GoogleLoginButton.jsx`
- All domain components (pet/, user/, admin/)
- `src/hooks/useInfiniteScroll.js`, `src/hooks/useImageUpload.js`, `src/hooks/useFormSubmit.js`
- Actual page UI implementations