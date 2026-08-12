# 🐾 PetVerse — Complete System Architecture

> **Platform:** Pet Adoption & Rehoming Platform with Marketplace Capabilities
> **Architecture Style:** Modular Monolith (Startup-Grade MVP, Evolvable to Ecosystem)
> **Date:** 2026-06-09

---

## Table of Contents

1. [Complete System Architecture Overview](#1-complete-system-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [MongoDB Database Schema Design](#4-mongodb-database-schema-design)
5. [Entity Relationships & Data Flow](#5-entity-relationships--data-flow)
6. [REST API Structure](#6-rest-api-structure)
7. [Authentication & Authorization Flow](#7-authentication--authorization-flow)
8. [Redux Toolkit State Management Architecture](#8-redux-toolkit-state-management-architecture)
9. [Socket.io Real-Time Communication Architecture](#9-socketio-real-time-communication-architecture)
10. [Cloudinary Media Management Architecture](#10-cloudinary-media-management-architecture)
11. [Deployment Architecture](#11-deployment-architecture)

---

## 1. Complete System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │  Desktop  │  │  Mobile  │  │  Tablet  │  │  Admin Dashboard   │  │
│  │  Browser  │  │  Browser │  │  Browser │  │  (React SPA)       │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┬──────────┘  │
│       └──────────────┴─────────────┴─────────────────┘              │
│                         │ HTTPS/WSS                                 │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────────┐
│                    CDN / REVERSE PROXY LAYER                         │
│  ┌──────────────────────┴────────────────────────────────────────┐  │
│  │  Nginx Reverse Proxy (SSL Termination, Static File Serving)   │  │
│  │  Rate Limiting | CORS | Gzip Compression | Proxy Pass         │  │
│  └──────────────────────┬────────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────────┐
│                    APPLICATION LAYER (Node.js)                        │
│  ┌──────────────────────┴────────────────────────────────────────┐  │
│  │                    Express.js Server                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│  │  │  Auth     │ │  Pets    │ │  Users   │ │  Admin          │  │  │
│  │  │  Module   │ │  Module  │ │  Module  │ │  Module         │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│  │  │  Saved    │ │  Search  │ │  Upload  │ │  Community      │  │  │
│  │  │  Module   │ │  Module  │ │  Module  │ │  Module (future)│  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Socket.io Server (Real-Time Layer)                │   │
│  │  Chat Namespace | Notification Namespace | Presence Tracker   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────────────┐
│                    DATA / STORAGE LAYER                               │
│  ┌──────────────────────┴────────────────────────────────────────┐  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │  │
│  │  │   MongoDB    │  │    Redis     │  │     Cloudinary       │ │  │
│  │  │  Atlas       │  │  (Cache +    │  │  (Image/Media CDN)   │ │  │
│  │  │  (Primary)   │  │   Session)   │  │                      │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Modular Monolith Structure

```
petaverse/
├── client/                         # React 19 Frontend (Vite SPA)
├── server/                         # Express.js Backend
│   ├── src/
│   │   ├── config/                 # App configuration
│   │   ├── modules/                # Domain-driven modules
│   │   │   ├── auth/               # Authentication module
│   │   │   ├── user/               # User profiles module
│   │   │   ├── pet/                # Pet listings module
│   │   │   ├── saved-pet/          # Saved pets module
│   │   │   ├── upload/             # Cloudinary upload module
│   │   │   ├── admin/              # Admin dashboard module
│   │   │   ├── chat/               # Real-time chat (future)
│   │   │   ├── notification/       # Notifications (future)
│   │   │   └── community/          # Community posts (future)
│   │   ├── middleware/             # Shared middleware
│   │   ├── utils/                  # Shared utilities
│   │   ├── socket/                 # Socket.io setup & handlers
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # HTTP + WebSocket server entry
│   └── package.json
├── plans/                          # Architecture & planning docs
└── README.md
```

### 1.3 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite + Tailwind CSS | SPA with fast builds, responsive UI |
| **State** | Redux Toolkit + RTK Query | Global state + API cache & fetching |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas (Mongoose ODM) | Primary data store |
| **Cache** | Redis (ioredis) | Session store, rate limiter, query cache |
| **Auth** | JWT (access + refresh tokens) + Google OAuth 2.0 | Authentication |
| **Media** | Cloudinary | Image upload, optimization, CDN delivery |
| **Real-Time** | Socket.io | Chat, notifications, presence (future-ready) |
| **Reverse Proxy** | Nginx | SSL termination, static serving, load balancing |
| **Deployment** | Railway / Render / AWS EC2 | Hosting |

---

## 2. Frontend Architecture

### 2.1 Directory Structure

```
client/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/                  # Reusable UI Components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── PetAvatar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx        # Main layout wrapper
│   │   │   ├── Header.jsx           # Top navigation
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx          # Filter sidebar
│   │   │   ├── MobileNav.jsx
│   │   │   └── AdminLayout.jsx      # Admin-specific layout
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── GoogleLoginButton.jsx
│   │   ├── pet/
│   │   │   ├── PetCard.jsx
│   │   │   ├── PetCardSkeleton.jsx
│   │   │   ├── PetGrid.jsx
│   │   │   ├── PetDetails.jsx
│   │   │   ├── PetForm.jsx
│   │   │   ├── PetImageCarousel.jsx
│   │   │   ├── SaveButton.jsx
│   │   │   └── ListingTypeBadge.jsx
│   │   ├── user/
│   │   │   ├── UserAvatar.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   └── MyListings.jsx
│   │   └── admin/
│   │       ├── StatsCard.jsx
│   │       ├── DataTable.jsx
│   │       ├── UserRow.jsx
│   │       └── PetRow.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PetListingPage.jsx       # Browse all listings
│   │   ├── PetDetailPage.jsx        # Single pet view
│   │   ├── CreateListingPage.jsx    # Post new listing
│   │   ├── EditListingPage.jsx
│   │   ├── SavedPetsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── EditProfilePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── LostFoundPage.jsx        # Lost & Found section
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminUsersPage.jsx
│   │       ├── AdminPetsPage.jsx
│   │       └── AdminListingsPage.jsx
│   ├── store/
│   │   ├── index.js                 # Redux store configuration
│   │   ├── api/
│   │   │   ├── apiSlice.js          # RTK Query base API
│   │   │   ├── authApi.js
│   │   │   ├── petApi.js
│   │   │   ├── userApi.js
│   │   │   ├── savedPetApi.js
│   │   │   ├── uploadApi.js
│   │   │   └── adminApi.js
│   │   └── slices/
│   │       ├── authSlice.js         # Auth state (tokens, user)
│   │       ├── uiSlice.js           # UI state (theme, sidebar, modals)
│   │       ├── filterSlice.js       # Search/filter state persistence
│   │       └── socketSlice.js       # Socket connection state
│   ├── hooks/
│   │   ├── useAuth.js               # Auth hook (login, logout, google)
│   │   ├── useDebounce.js           # Debounced search
│   │   ├── useInfiniteScroll.js     # Infinite scroll pagination
│   │   ├── useSocket.js             # Socket.io hook
│   │   ├── useImageUpload.js        # Cloudinary upload hook
│   │   └── useMediaQuery.js         # Responsive breakpoint hook
│   ├── utils/
│   │   ├── constants.js             # App-wide constants
│   │   ├── validators.js            # Form validation helpers
│   │   ├── formatters.js            # Date, currency, text formatters
│   │   ├── storage.js               # LocalStorage wrapper
│   │   └── cn.js                    # Tailwind class name merger
│   ├── router/
│   │   └── AppRouter.jsx            # React Router v6+ config
│   ├── App.jsx
│   ├── main.jsx                     # Vite entry point
│   └── index.css                    # Tailwind directives + global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### 2.2 Component Hierarchy & Data Flow

```
App.jsx
├── Redux Provider (store)
├── AppRouter
│   ├── AppLayout
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── SearchBar (dispatches to filterSlice)
│   │   │   ├── Navigation Links
│   │   │   └── UserAvatar / GoogleLoginButton
│   │   ├── Main Content (React Router Outlet)
│   │   │   ├── HomePage
│   │   │   │   ├── Hero Section
│   │   │   │   ├── Featured Pets (PetGrid → PetCard[])
│   │   │   │   └── Category Links
│   │   │   ├── PetListingPage
│   │   │   │   ├── FilterPanel (Sidebar or Modal)
│   │   │   │   ├── PetGrid → PetCard[] + Skeleton
│   │   │   │   └── Pagination / InfiniteScroll
│   │   │   ├── PetDetailPage
│   │   │   │   ├── PetImageCarousel
│   │   │   │   ├── PetInfo
│   │   │   │   ├── SaveButton
│   │   │   │   └── OwnerInfo (ProfileCard)
│   │   │   ├── ProfilePage
│   │   │   │   ├── ProfileCard
│   │   │   │   └── MyListings → PetGrid
│   │   │   └── AdminDashboardPage
│   │   │       ├── StatsCard[]
│   │   │       └── DataTable
│   │   └── Footer
│   └── AdminLayout (nested layout for admin routes)
└── Toast (global notification)
```

### 2.3 Route Architecture

| Path | Page | Auth | Layout |
|------|------|------|--------|
| `/` | HomePage | Public | AppLayout |
| `/pets` | PetListingPage | Public | AppLayout |
| `/pets/:id` | PetDetailPage | Public | AppLayout |
| `/pets/new` | CreateListingPage | Protected | AppLayout |
| `/pets/:id/edit` | EditListingPage | Protected | AppLayout |
| `/lost-found` | LostFoundPage | Public | AppLayout |
| `/saved` | SavedPetsPage | Protected | AppLayout |
| `/profile/:id` | ProfilePage | Public | AppLayout |
| `/profile/edit` | EditProfilePage | Protected | AppLayout |
| `/login` | LoginPage | Public | AppLayout |
| `/admin` | AdminDashboardPage | Admin | AdminLayout |
| `/admin/users` | AdminUsersPage | Admin | AdminLayout |
| `/admin/pets` | AdminPetsPage | Admin | AdminLayout |
| `*` | NotFoundPage | Public | AppLayout |

### 2.4 Key Frontend Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build Tool | Vite | Fast HMR, ESM-native, optimized builds |
| Styling | Tailwind CSS 4 | Utility-first, design-system consistency, purge unused CSS |
| Routing | React Router v6+ | Nested layouts, loaders, lazy loading with `React.lazy()` |
| API Fetching | RTK Query | Cache management, auto-tag invalidation, optimistic updates |
| Forms | React Hook Form + Zod | Performant, schema-based validation |
| Image Lazy Loading | `loading="lazy"` + Intersection Observer | Core web vitals optimization |
| Code Splitting | Route-based `React.lazy()` | Reduce initial bundle, faster LCP |
| SEO | `react-helmet-async` | Dynamic meta tags per page |

---

## 3. Backend Architecture

### 3.1 Directory Structure (Domain-Driven Modular Monolith)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                   # MongoDB connection (Mongoose)
│   │   ├── redis.js                # Redis connection (ioredis)
│   │   ├── cloudinary.js           # Cloudinary SDK config
│   │   ├── env.js                  # Environment variable validation (dotenv + Joi)
│   │   └── cors.js                 # CORS options
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   ├── admin.js                # Admin role check middleware
│   │   ├── upload.js               # Multer config for temp file handling
│   │   ├── validate.js             # Joi/Zod validation middleware factory
│   │   ├── errorHandler.js         # Global error handling middleware
│   │   ├── rateLimiter.js          # Rate limiting (express-rate-limit + Redis)
│   │   ├── notFound.js             # 404 handler
│   │   └── logger.js               # Request logging (morgan or pino)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   │
│   │   ├── pet/
│   │   │   ├── pet.controller.js
│   │   │   ├── pet.service.js
│   │   │   ├── pet.routes.js
│   │   │   └── pet.validation.js
│   │   │
│   │   ├── saved-pet/
│   │   │   ├── savedPet.controller.js
│   │   │   ├── savedPet.service.js
│   │   │   └── savedPet.routes.js
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.controller.js
│   │   │   ├── upload.service.js
│   │   │   └── upload.routes.js
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.routes.js
│   │   │
│   │   ├── chat/                    # Future: Real-time messaging
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   └── chat.routes.js
│   │   │
│   │   ├── notification/            # Future: Notifications
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   └── notification.routes.js
│   │   │
│   │   └── community/               # Future: Community posts
│   │       ├── community.controller.js
│   │       ├── community.service.js
│   │       └── community.routes.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── SavedPet.js
│   │   ├── Token.js                 # Refresh token blacklist
│   │   ├── Message.js               # Future
│   │   ├── Conversation.js          # Future
│   │   ├── Notification.js          # Future
│   │   ├── CommunityPost.js         # Future
│   │   └── Review.js                # Future
│   │
│   ├── socket/
│   │   ├── index.js                 # Socket.io server initialization
│   │   ├── auth.js                  # Socket authentication middleware
│   │   ├── chatHandler.js           # Chat event handlers (future)
│   │   └── notificationHandler.js   # Notification event handlers (future)
│   │
│   ├── utils/
│   │   ├── AppError.js              # Custom error class
│   │   ├── catchAsync.js            # Async error wrapper
│   │   ├── apiFeatures.js           # Filtering, sorting, pagination, search builder
│   │   ├── jwt.js                   # JWT sign/verify helpers
│   │   ├── googleOAuth.js           # Google token verification
│   │   ├── cloudinaryHelper.js      # Upload/delete/transform helpers
│   │   └── constants.js             # Enums, statuses, roles
│   │
│   ├── app.js                       # Express app setup (middleware, routes, socket)
│   └── server.js                    # HTTP server + Socket.io + DB connection
│
├── .env.example
├── .gitignore
└── package.json
```

### 3.2 Middleware Execution Pipeline

```
Incoming Request
    │
    ▼
[logger] ──► Log request method, URL, status, response time
    │
    ▼
[cors] ──► CORS headers based on env config (allowed origins)
    │
    ▼
[rateLimiter] ──► Rate limit (100 req/15min general, 5 req/15min auth routes)
    │
    ▼
[express.json()] ──► Parse JSON body (limit: 10mb)
    │
    ▼
[express.urlencoded()] ──► Parse URL-encoded body
    │
    ▼
[Routes Match]
    │
    ├── Public Routes ──► skip auth
    │
    └── Protected Routes
            │
            ▼
        [auth middleware] ──► Verify JWT, attach req.user
            │
            ├── User Routes ──► continue
            │
            └── Admin Routes
                    │
                    ▼
                [admin middleware] ──► Check req.user.role === 'admin'
                    │
                    ▼
                [Controller]
    │
    ▼
[notFound] ──► 404 for unmatched routes
    │
    ▼
[errorHandler] ──► Global error handler (operational vs programming errors)
    │
    ▼
Response Sent
```

### 3.3 API Features Utility (Query Builder)

The [`apiFeatures.js`](server/src/utils/apiFeatures.js) utility provides a consistent query-building pattern across all list endpoints:

| Feature | Implementation | Example Query Param |
|---------|---------------|---------------------|
| **Filtering** | `Model.find(filterObj)` | `?type=adoption&species=dog` |
| **Searching** | `$regex` on text fields | `?search=golden+retriever` |
| **Sorting** | `.sort(sortStr)` | `?sort=-createdAt` (descending) |
| **Field Limiting** | `.select(fieldsStr)` | `?fields=name,breed,age` |
| **Pagination** | `.skip().limit()` | `?page=2&limit=12` |
| **Population** | `.populate(ref)` | `?populate=owner` |

### 3.4 Error Handling Strategy

```
Custom Error Class: AppError
├── message: string
├── statusCode: number
├── status: 'fail' | 'error'
├── isOperational: true

Error Handler Middleware:
├── Development: Send full stack trace
├── Production: Send clean error message
│   ├── Operational Errors (AppError) → Send message + statusCode
│   ├── Mongoose ValidationError → 400
│   ├── Mongoose CastError (invalid ObjectId) → 400
│   ├── Mongoose Duplicate Key (11000) → 409
│   ├── JWT ExpiredError → 401
│   ├── JWT JsonWebTokenError → 401
│   └── Unknown Errors → 500 "Something went wrong"
```

---

## 4. MongoDB Database Schema Design

### 4.1 User Collection

```javascript
User {
  _id:              ObjectId,
  googleId:         String,          // Google OAuth ID (unique, sparse index)
  name:             String,          // required, trim
  email:            String,          // required, unique, lowercase
  avatar: {
    url:            String,          // Cloudinary URL
    publicId:       String,          // Cloudinary public_id for deletion
  },
  bio:              String,          // max 500 chars
  phone:            String,          // optional contact
  location: {
    city:           String,
    state:          String,
    country:        String,
  },
  role:             String,          // enum: ['user', 'admin'], default: 'user'
  isVerified:       Boolean,         // default: false
  isActive:         Boolean,         // default: true (soft delete)
  lastLoginAt:      Date,
  createdAt:        Date,
  updatedAt:        Date,
}

// Indexes:
// { email: 1 }            - unique
// { googleId: 1 }          - unique, sparse
// { role: 1 }              - admin queries
// { 'location.city': 1 }   - location-based queries
```

### 4.2 Pet (Listing) Collection

```javascript
Pet {
  _id:              ObjectId,
  owner:            ObjectId,        // ref: 'User', required
  name:             String,          // required, trim
  species:          String,          // enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other']
  breed:            String,
  age:              {
    value:          Number,          // required
    unit:           String,          // enum: ['days', 'weeks', 'months', 'years']
  },
  gender:           String,          // enum: ['male', 'female', 'unknown']
  size:             String,          // enum: ['small', 'medium', 'large', 'xlarge']
  color:            String,
  description:      String,          // max 2000 chars
  healthStatus: {
    vaccinated:     Boolean,
    neutered:       Boolean,
    microchipped:   Boolean,
    notes:          String,
  },
  listingType:      String,          // enum: ['adoption', 'rehoming', 'sale', 'lost', 'found']
  status:           String,          // enum: ['available', 'pending', 'adopted', 'sold', 'resolved', 'removed']
  price:            Number,          // required for 'sale' type, min: 0
  isNegotiable:     Boolean,         // only for sale type (future)
  location: {
    city:           String,          // required
    state:          String,
    country:        String,
    coordinates: {                   // GeoJSON for future location search
      type:         { type: String, enum: ['Point'] },
      coordinates:  [Number],        // [longitude, latitude]
    },
  },
  images: [{
    url:            String,          // Cloudinary URL
    publicId:       String,          // Cloudinary public_id
    isPrimary:      Boolean,         // default: false
  }],
  tags:             [String],        // e.g., ['friendly', 'house-trained', 'good-with-kids']
  contactInfo: {
    phone:          String,
    email:          String,
    preferredMethod: String,         // enum: ['phone', 'email', 'platform']
  },
  viewCount:        Number,          // default: 0
  isActive:         Boolean,         // default: true (soft delete)
  isVerified:       Boolean,         // default: false (admin verification)
  isFeatured:       Boolean,         // default: false (admin can feature listings)
  createdAt:        Date,
  updatedAt:        Date,
}

// Indexes:
// { owner: 1 }                                    - user's listings
// { listingType: 1, status: 1 }                   - filtered browse
// { species: 1, breed: 1 }                        - species/breed filter
// { listingType: 1, 'location.city': 1 }          - type + city combo
// { tags: 1 }                                      - tag-based search
// { status: 1, createdAt: -1 }                    - recent available pets
// { 'location.coordinates': '2dsphere' }          - geospatial (future)
// TEXT index on { name, breed, description, tags } - full text search
```

### 4.3 SavedPet Collection

```javascript
SavedPet {
  _id:              ObjectId,
  user:             ObjectId,        // ref: 'User', required
  pet:              ObjectId,        // ref: 'Pet', required
  createdAt:        Date,
}

// Indexes:
// { user: 1, pet: 1 }   - unique compound index (no duplicate saves)
// { user: 1 }            - get all saved pets for a user
// { pet: 1 }             - count saves per pet
```

### 4.4 Token Collection (Refresh Token Blacklist)

```javascript
Token {
  _id:              ObjectId,
  userId:           ObjectId,        // ref: 'User', required
  token:            String,          // hashed refresh token
  type:             String,          // enum: ['refresh']
  expiresAt:        Date,            // TTL index for auto-cleanup
  createdAt:        Date,
}

// Indexes:
// { token: 1 }         - unique
// { userId: 1 }         - find all tokens for user
// { expiresAt: 1 }     - TTL index (auto-delete expired)
```

### 4.5 Future Collections (Schema-Ready, Not Implemented in MVP)

```javascript
// ---- Chat Module (Future) ----

Conversation {
  _id:              ObjectId,
  participants:     [ObjectId],      // ref: 'User' (max 2 for MVP)
  pet:              ObjectId,        // ref: 'Pet' (context listing)
  lastMessage: {
    content:        String,
    sender:         ObjectId,
    sentAt:         Date,
  },
  updatedAt:        Date,
  createdAt:        Date,
}

Message {
  _id:              ObjectId,
  conversation:     ObjectId,        // ref: 'Conversation'
  sender:           ObjectId,        // ref: 'User'
  content:          String,          // required
  readBy:           [ObjectId],      // users who have read this message
  createdAt:        Date,
}

// ---- Notification Module (Future) ----

Notification {
  _id:              ObjectId,
  recipient:        ObjectId,        // ref: 'User'
  type:             String,          // enum: ['new_message', 'listing_update', 'saved_pet_update', 'admin_notice']
  title:            String,
  message:          String,
  reference: {
    model:          String,          // e.g., 'Pet', 'Message', 'User'
    id:             ObjectId,
  },
  isRead:           Boolean,         // default: false
  createdAt:        Date,
}

// ---- Community Module (Future) ----

CommunityPost {
  _id:              ObjectId,
  author:           ObjectId,        // ref: 'User'
  content:          String,          // required
  images: [{ url: String, publicId: String }],
  tags:             [String],
  likes:            [ObjectId],      // ref: 'User'
  commentCount:     Number,          // default: 0
  isActive:         Boolean,
  createdAt:        Date,
  updatedAt:        Date,
}

CommunityComment {
  _id:              ObjectId,
  post:             ObjectId,        // ref: 'CommunityPost'
  author:           ObjectId,        // ref: 'User'
  content:          String,
  isActive:         Boolean,
  createdAt:        Date,
}

// ---- Reviews Module (Future) ----

Review {
  _id:              ObjectId,
  reviewer:         ObjectId,        // ref: 'User'
  reviewee:         ObjectId,        // ref: 'User' (person being reviewed)
  pet:              ObjectId,        // ref: 'Pet' (optional context)
  rating:           Number,          // 1-5
  comment:          String,
  createdAt:        Date,
  updatedAt:        Date,
}
```

---

## 5. Entity Relationships & Data Flow

### 5.1 Entity Relationship Diagram

```
┌──────────────┐        1:N        ┌──────────────┐
│              │◄──────────────────│              │
│     USER     │                   │     PET      │
│              │──────────────────►│              │
└──────┬───────┘      owner        └──────┬───────┘
       │                                   │
       │ 1:N                               │ 1:N
       │                                   │
       ▼                                   ▼
┌──────────────┐                  ┌──────────────┐
│  SAVED PET   │                  │    IMAGE     │
│  (junction)  │                  │  (embedded)  │
└──────────────┘                  └──────────────┘
       │
       │ N:1 (user + pet compound unique)
       │
       └─────────────────────────────┘

┌──────────────┐                  ┌──────────────┐
│    TOKEN     │ N:1              │              │
│  (refresh)   │─────────────────►│    USER      │
└──────────────┘                  └──────────────┘


FUTURE ENTITIES (designed but not built):

┌──────────────┐                  ┌──────────────┐
│ CONVERSATION │ 1:N              │   MESSAGE    │
│  (2 users)   │─────────────────►│              │
└──────┬───────┘                  └──────────────┘
       │ N:1                               │ N:1
       ▼                                   ▼
┌──────────────┐                  ┌──────────────┐
│     USER     │                  │     USER     │
│ (participant)│                  │   (sender)   │
└──────────────┘                  └──────────────┘

┌──────────────┐ 1:N     ┌──────────────┐
│ COMMUNITY    │────────►│  COMMUNITY   │
│   POST       │         │   COMMENT    │
└──────────────┘         └──────────────┘
       │ N:1                    │ N:1
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│     USER     │         │     USER     │
└──────────────┘         └──────────────┘

┌──────────────┐ N:1     ┌──────────────┐
│   REVIEW     │────────►│     USER     │
│              │         │  (reviewee)  │
│              │───N:1──►│  (reviewer)  │
└──────────────┘         └──────────────┘

┌──────────────┐ N:1     ┌──────────────┐
│ NOTIFICATION │────────►│     USER     │
│              │         │  (recipient) │
└──────────────┘         └──────────────┘
```

### 5.2 Core Data Flows

#### Flow 1: User Browses & Saves a Pet

```
[PetListingPage]
    │
    ├─► GET /api/pets?type=adoption&species=dog&page=1&limit=12
    │   (RTK Query fetches, caches response)
    │
    ├─► User clicks PetCard
    │   └─► Navigate to /pets/:id
    │       └─► GET /api/pets/:id (increment viewCount server-side)
    │
    └─► User clicks SaveButton
        └─► POST /api/saved-pets { petId }
            ├─► Check SavedPet collection for existing {user, pet}
            ├─► If exists: DELETE → unsave
            └─► If not exists: CREATE → save
            └─► RTK Query invalidates 'SavedPets' cache tag
```

#### Flow 2: User Creates a Listing

```
[CreateListingPage]
    │
    ├─► Fill PetForm (React Hook Form + Zod validation)
    │
    ├─► Upload images via ImageUploader
    │   └─► POST /api/upload (multipart/form-data)
    │       ├─► Multer receives file (temp storage)
    │       ├─► Cloudinary upload (auto-optimize, auto-tag)
    │       ├─► Delete temp file
    │       └─► Response: { url, publicId, width, height }
    │   └─► Store returned image data in form state
    │
    └─► Submit form
        └─► POST /api/pets { ...formData, images: [...] }
            ├─► Validate (Joi/Zod) in pet.validation.js
            ├─► Create Pet document in MongoDB
            ├─► Response: new Pet object
            └─► RTK Query invalidates 'Pets' cache tag
            └─► Navigate to /pets/:newId
```

#### Flow 3: Admin Reviews & Manages

```
[AdminDashboardPage]
    │
    ├─► GET /api/admin/stats
    │   └─► Aggregation pipeline:
    │       ├─► Total users count
    │       ├─► Total pets count (grouped by listingType + status)
    │       ├─► New users this week
    │       └─► New listings this week
    │
    ├─► GET /api/admin/users?page=1&search=...
    │   └─► User list with pagination + search
    │
    ├─► PATCH /api/admin/users/:id/toggle-status
    │   └─► Activate/deactivate user
    │
    ├─► GET /api/admin/pets?status=pending&page=1
    │   └─► Pets awaiting verification
    │
    ├─► PATCH /api/admin/pets/:id/verify
    │   └─► Set isVerified: true
    │
    └─► PATCH /api/admin/pets/:id/feature
        └─► Toggle isFeatured: true/false
```

### 5.3 Caching Strategy

| Data Type | Caching Strategy | TTL | Invalidation Trigger |
|-----------|-----------------|-----|---------------------|
| Pet Listings (public) | RTK Query client-side cache | 5 min stale | New pet created, pet updated, pet deleted |
| Pet Detail | RTK Query client-side cache | 2 min stale | Same pet updated/deleted |
| User Profile | RTK Query client-side cache | 5 min stale | Profile updated |
| Saved Pets | RTK Query client-side cache | 1 min stale | Save/unsave action |
| Admin Stats | RTK Query client-side cache | 1 min stale | Manual refresh |
| Search Results | No cache — always fresh | N/A | N/A |
| Static Assets | Cloudinary CDN + Nginx | 1 year | New deployment |

---

## 6. REST API Structure

### 6.1 Base URL & Versioning

```
Base: /api/v1
```

### 6.2 Complete API Endpoint Map

#### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/google` | Public | Google OAuth login/signup (receives `credential` token) |
| `POST` | `/auth/refresh` | Public | Refresh access token using refresh token (httpOnly cookie) |
| `POST` | `/auth/logout` | Protected | Invalidate refresh token |
| `GET` | `/auth/me` | Protected | Get current authenticated user |

#### Users (`/api/v1/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/:id` | Public | Get public user profile |
| `PATCH` | `/users/profile` | Protected | Update own profile (name, bio, avatar, phone, location) |
| `DELETE` | `/users/account` | Protected | Soft-delete own account (set isActive: false) |
| `GET` | `/users/:id/listings` | Public | Get all active listings by a user |

#### Pets / Listings (`/api/v1/pets`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/pets` | Public | List pets with filtering, sorting, searching, pagination |
| `GET` | `/pets/:id` | Public | Get single pet with populated owner |
| `POST` | `/pets` | Protected | Create new pet listing |
| `PATCH` | `/pets/:id` | Protected | Update own pet listing (owner only) |
| `DELETE` | `/pets/:id` | Protected | Soft-delete own pet listing (owner only) |
| `POST` | `/pets/:id/view` | Public | Increment view count (debounced) |
| `GET` | `/pets/featured` | Public | Get featured/advertised listings |
| `GET` | `/pets/search/suggestions` | Public | Autocomplete search suggestions |

#### Saved Pets (`/api/v1/saved-pets`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/saved-pets` | Protected | Get all saved pets for current user |
| `POST` | `/saved-pets` | Protected | Save a pet (toggle: save/unsave) |
| `DELETE` | `/saved-pets/:id` | Protected | Unsave a specific pet |
| `GET` | `/saved-pets/check/:petId` | Protected | Check if a pet is saved by current user |

#### Upload (`/api/v1/upload`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload/single` | Protected | Upload single image (max 5MB) |
| `POST` | `/upload/multiple` | Protected | Upload up to 5 images (max 5MB each) |
| `DELETE` | `/upload` | Protected | Delete image by publicId |

#### Admin (`/api/v1/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/stats` | Admin | Dashboard statistics |
| `GET` | `/admin/users` | Admin | List all users (paginated, searchable) |
| `GET` | `/admin/users/:id` | Admin | Get detailed user info |
| `PATCH` | `/admin/users/:id/toggle-status` | Admin | Activate/deactivate user account |
| `PATCH` | `/admin/users/:id/role` | Admin | Change user role |
| `GET` | `/admin/pets` | Admin | List all pets (paginated, filterable by status) |
| `GET` | `/admin/pets/:id` | Admin | Get detailed pet info |
| `PATCH` | `/admin/pets/:id/verify` | Admin | Verify a pet listing |
| `PATCH` | `/admin/pets/:id/feature` | Admin | Toggle featured status |
| `DELETE` | `/admin/pets/:id` | Admin | Hard delete or remove a pet listing |

### 6.3 Standard API Response Format

#### Success Response

```javascript
{
  status: "success",
  message: "Pets retrieved successfully",
  data: { ... },              // Single object or array
  results: 42,                // Total count (list endpoints only)
  pagination: {               // List endpoints only
    page: 1,
    limit: 12,
    totalPages: 4,
    hasNextPage: true,
    hasPrevPage: false,
  },
}
```

#### Error Response

```javascript
{
  status: "fail" | "error",
  message: "Human-readable error message",
  errors: [                   // Validation errors (array)
    { field: "email", message: "Please provide a valid email" },
  ],
  stack: "..."                // Only in development
}
```

### 6.4 Query Parameter Standards (for GET list endpoints)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 12 | Items per page |
| `sort` | String | `-createdAt` | Sort field (prefix `-` for descending) |
| `fields` | String | All | Comma-separated fields to return |
| `search` | String | — | Full-text search query |
| `species` | String | — | Filter by species |
| `breed` | String | — | Filter by breed |
| `listingType` | String | — | `adoption`, `rehoming`, `sale`, `lost`, `found` |
| `status` | String | `available` | Status filter |
| `gender` | String | — | `male`, `female`, `unknown` |
| `size` | String | — | `small`, `medium`, `large`, `xlarge` |
| `ageMin` | Number | — | Minimum age value |
| `ageMax` | Number | — | Maximum age value |
| `city` | String | — | Filter by city |
| `state` | String | — | Filter by state |
| `priceMin` | Number | — | Min price (sale type) |
| `priceMax` | Number | — | Max price (sale type) |

---

## 7. Authentication & Authorization Flow

### 7.1 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                               │
│                                                                      │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────────┐  │
│  │  CLIENT  │     │  SERVER  │     │  GOOGLE  │     │  MONGODB   │  │
│  │  (React) │     │ (Express)│     │  OAuth   │     │  + REDIS   │  │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘     └─────┬──────┘  │
│       │                │                │                  │         │
│  ┌────┴────────────────┴────────────────┴──────────────────┴──────┐  │
│  │                    GOOGLE OAUTH FLOW                            │  │
│  │                                                                  │  │
│  │  1. User clicks "Continue with Google"                          │  │
│  │  2. @react-oauth/google displays Google One Tap popup           │  │
│  │  3. Google returns credential (ID token) to client              │  │
│  │  4. Client POSTs credential to POST /api/v1/auth/google         │  │
│  │  5. Server verifies token with Google's tokeninfo endpoint      │  │
│  │  6. Server finds or creates user by email/googleId              │  │
│  │  7. Server generates JWT access token (15 min expiry)           │  │
│  │  8. Server generates refresh token (7 days expiry)              │  │
│  │  9. Refresh token stored in MongoDB Token collection            │  │
│  │  10. Refresh token set as httpOnly secure cookie               │  │
│  │  11. Access token returned in response body                     │  │
│  │  12. Client stores access token in Redux + localStorage         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    TOKEN REFRESH FLOW                             │  │
│  │                                                                  │  │
│  │  1. RTK Query interceptor detects 401 response                   │  │
│  │  2. Client calls POST /api/v1/auth/refresh                       │  │
│  │  3. Server reads refresh token from httpOnly cookie              │  │
│  │  4. Server verifies refresh token JWT                            │  │
│  │  5. Server checks token exists in MongoDB (not blacklisted)      │  │
│  │  6. Server generates new access token                            │  │
│  │  7. Server rotates refresh token (old one deleted, new created)  │  │
│  │  8. New refresh token set in httpOnly cookie                     │  │
│  │  9. New access token returned to client                          │  │
│  │  10. Failed requests retried with new access token               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    LOGOUT FLOW                                    │  │
│  │                                                                  │  │
│  │  1. Client calls POST /api/v1/auth/logout                        │  │
│  │  2. Server deletes refresh token from MongoDB                    │  │
│  │  3. Server clears httpOnly cookie                                │  │
│  │  4. Client clears access token from Redux + localStorage         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Token Configuration

| Token Type | Storage | Expiry | Format |
|------------|---------|--------|--------|
| **Access Token** | Redux store + localStorage | 15 minutes | JWT (signed with ACCESS_SECRET) |
| **Refresh Token** | httpOnly secure cookie | 7 days | JWT (signed with REFRESH_SECRET) |

### 7.3 JWT Payload

```javascript
// Access Token Payload
{
  userId: "649a1b2c3d4e5f6a7b8c9d0e",
  email: "user@gmail.com",
  role: "user",
  iat: 1687856400,
  exp: 1687857300,   // +15 minutes
}

// Refresh Token Payload
{
  userId: "649a1b2c3d4e5f6a7b8c9d0e",
  type: "refresh",
  iat: 1687856400,
  exp: 1688461200,   // +7 days
}
```

### 7.4 Authorization Levels

| Role | Permissions |
|------|-------------|
| **Public (unauthenticated)** | Browse pets, view pet details, view profiles, search |
| **User (authenticated)** | All public + create/edit/delete own listings, save/unsave pets, update profile |
| **Admin** | All user + dashboard stats, manage users (activate/deactivate, change role), verify/feature/remove listings |

### 7.5 Security Measures

| Measure | Implementation |
|---------|---------------|
| HTTPS Only | All cookies set with `secure: true` in production |
| httpOnly Cookies | Refresh token inaccessible to JavaScript |
| SameSite | `sameSite: 'strict'` to prevent CSRF |
| Token Rotation | New refresh token on each refresh; old invalidated |
| Rate Limiting | Auth routes: 5 attempts per 15 min per IP |
| Password-less | Only Google OAuth — no password storage, no password reset flow |
| CORS | Whitelist frontend origin only |
| Helmet.js | Security headers (XSS, clickjack, MIME sniffing protection) |

---

## 8. Redux Toolkit State Management Architecture

### 8.1 Store Configuration

```javascript
// store/index.js
store = configureStore({
  reducer: {
    // RTK Query API slices (auto-generated reducers)
    [authApi.reducerPath]:      authApi.reducer,
    [petApi.reducerPath]:       petApi.reducer,
    [userApi.reducerPath]:      userApi.reducer,
    [savedPetApi.reducerPath]:  savedPetApi.reducer,
    [uploadApi.reducerPath]:    uploadApi.reducer,
    [adminApi.reducerPath]:     adminApi.reducer,

    // Local state slices
    auth:       authSlice.reducer,
    ui:         uiSlice.reducer,
    filter:     filterSlice.reducer,
    socket:     socketSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      petApi.middleware,
      userApi.middleware,
      savedPetApi.middleware,
      uploadApi.middleware,
      adminApi.middleware,
    ),
})
```

### 8.2 RTK Query API Slice Design

#### Base API Slice (`api/apiSlice.js`)

```
Base URL: /api/v1
Credentials: 'include' (sends httpOnly cookies)

Base Query with:
├── prepareHeaders: Attach Authorization: Bearer <accessToken>
├── baseQueryWithReauth: 401 interceptor
│   ├── On 401 → attempt token refresh
│   ├── On refresh success → retry original request
│   └── On refresh failure → logout user
└── Tag Types: ['Auth', 'Pets', 'Pet', 'Users', 'User',
                'SavedPets', 'AdminStats', 'AdminUsers', 'AdminPets']
```

#### API Slice: `authApi.js`

| Endpoint | Method | Cache Tag | Invalidation |
|----------|--------|-----------|-------------|
| `googleLogin` | Mutation | `['Auth']` | Invalidate Auth |
| `refreshToken` | Mutation | — | — |
| `logout` | Mutation | `['Auth']` | Invalidate Auth |
| `getMe` | Query | `['Auth']` | — |

#### API Slice: `petApi.js`

| Endpoint | Method | Cache Tag | Invalidation |
|----------|--------|-----------|-------------|
| `getPets` | Query | `['Pets', {type: 'list'}]` | — |
| `getPet` | Query | `['Pet', petId]` | Provides Pet detail |
| `createPet` | Mutation | — | Invalidate `['Pets']` |
| `updatePet` | Mutation | — | Invalidate `['Pets', 'Pet', petId]` |
| `deletePet` | Mutation | — | Invalidate `['Pets']` |
| `getFeaturedPets` | Query | `['Pets', {type: 'featured'}]` | — |
| `getSuggestions` | Query | — | No caching |
| `incrementView` | Mutation | — | — |

#### API Slice: `savedPetApi.js`

| Endpoint | Method | Cache Tag | Invalidation |
|----------|--------|-----------|-------------|
| `getSavedPets` | Query | `['SavedPets']` | — |
| `toggleSave` | Mutation | — | Invalidate `['SavedPets', 'Pet', petId]` |
| `checkSaved` | Query | `['SavedPets', petId]` | — |

#### API Slice: `adminApi.js`

| Endpoint | Method | Cache Tag | Invalidation |
|----------|--------|-----------|-------------|
| `getStats` | Query | `['AdminStats']` | — |
| `getUsers` | Query | `['AdminUsers']` | — |
| `getUser` | Query | `['AdminUsers', userId]` | — |
| `toggleUserStatus` | Mutation | — | Invalidate `['AdminUsers']` |
| `changeUserRole` | Mutation | — | Invalidate `['AdminUsers']` |
| `getAdminPets` | Query | `['AdminPets']` | — |
| `verifyPet` | Mutation | — | Invalidate `['AdminPets', 'Pets']` |
| `featurePet` | Mutation | — | Invalidate `['AdminPets', 'Pets']` |

### 8.3 Local State Slices

#### `authSlice.js`

```javascript
// State Shape
{
  user:           null | { _id, name, email, avatar, role, ... },
  accessToken:    null | string,
  isAuthenticated: boolean,
  isLoading:      boolean,
  error:          null | string,
}

// Reducers
├── setCredentials(user, accessToken)   // On login/refresh success
├── clearCredentials()                  // On logout
└── setLoading(bool)                    // Auth loading state

// Selectors
├── selectCurrentUser
├── selectIsAuthenticated
├── selectIsAdmin         → user?.role === 'admin'
└── selectAccessToken
```

#### `uiSlice.js`

```javascript
// State Shape
{
  sidebarOpen:      boolean,
  mobileFilterOpen: boolean,
  theme:            'light' | 'dark',   // future dark mode
  toast: {
    show:           boolean,
    message:        string,
    type:           'success' | 'error' | 'info' | 'warning',
  },
  confirmDialog: {
    show:           boolean,
    title:          string,
    message:        string,
    onConfirm:      null,               // stored as action meta (not serialized)
  },
}

// Reducers
├── toggleSidebar()
├── toggleMobileFilter()
├── showToast({ message, type })
├── hideToast()
├── showConfirmDialog({ title, message })
└── hideConfirmDialog()
```

#### `filterSlice.js`

```javascript
// State Shape
{
  search:           '',
  species:          null,
  breed:            null,
  listingType:      null,
  gender:           null,
  size:             null,
  ageMin:           null,
  ageMax:           null,
  city:             null,
  state:            null,
  priceMin:         null,
  priceMax:         null,
  sort:             '-createdAt',
  page:             1,
  limit:            12,
}

// Reducers
├── setFilter({ key, value })
├── setFilters({ ...filters })
├── resetFilters()
├── setPage(page)
└── setSort(sort)

// Selectors
└── selectQueryParams    → Memoized selector that returns clean query string
```

#### `socketSlice.js`

```javascript
// State Shape
{
  isConnected:    boolean,
  onlineUsers:    [],      // future: presence tracking
  unreadCount:    0,       // future: notification badge
}

// Reducers
├── setConnected(bool)
├── setOnlineUsers(users[])
├── incrementUnread()
├── resetUnread()
```

### 8.4 RTK Query Cache Invalidation Strategy

```
State Flow:
                    ┌──────────────────┐
                    │   User Action    │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Create Pet     Update Pet     Delete Pet
              │              │              │
              └──────────────┴──────────────┘
                             │
              invalidatesTags: ['Pets']
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        getPets refetch  getFeaturedPets  getSuggestions
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
        Pet Detail (if cached)     Admin Pets (if cached)
```

---

## 9. Socket.io Real-Time Communication Architecture

### 9.1 Future-Ready Design

Socket.io is designed into the architecture from day one but implemented only when chat/notifications are built. The infrastructure is prepared:

```
┌─────────────────────────────────────────────────────────────┐
│                   SOCKET.IO ARCHITECTURE                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Socket.io Server                        │   │
│  │  (attached to same HTTP server as Express)           │   │
│  │                                                       │   │
│  │  Namespaces:                                         │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  /chat          │  Chat messages            │    │   │
│  │  │  /notifications │  Real-time notifications  │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                       │   │
│  │  Middleware:                                         │   │
│  │  ├── socketAuth: Verify JWT token on connection     │   │
│  │  ├── socketLogger: Log socket events                │   │
│  │  └── socketRateLimiter: Rate limit socket events    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Event Map (Designed, Not Implemented)

#### Chat Namespace (`/chat`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:join` | Client → Server | `{ conversationId }` | Join a conversation room |
| `chat:leave` | Client → Server | `{ conversationId }` | Leave a conversation room |
| `chat:message` | Client → Server | `{ conversationId, content }` | Send a message |
| `chat:message` | Server → Client | `{ conversationId, message }` | Receive a message |
| `chat:typing` | Client → Server | `{ conversationId }` | User is typing |
| `chat:typing` | Server → Client | `{ conversationId, userId }` | Broadcast typing |
| `chat:read` | Client → Server | `{ conversationId, messageId }` | Mark as read |
| `chat:unread-count` | Server → Client | `{ count }` | Unread message count |

#### Notification Namespace (`/notifications`)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `notification:new` | Server → Client | `{ notification }` | New notification pushed |
| `notification:read` | Client → Server | `{ notificationId }` | Mark notification as read |
| `notification:read-all` | Client → Server | — | Mark all as read |
| `notification:count` | Server → Client | `{ count }` | Unread notification count |

### 9.3 Redis Adapter for Socket.io

```
For horizontal scaling in the future:
├── @socket.io/redis-adapter
├── Enables multiple Node.js processes to share socket state
├── pub/sub pattern for cross-process event broadcasting
└── Not needed for MVP (single process)
```

### 9.4 Client-Side Socket Hook (`useSocket.js`)

```
useSocket Hook:
├── Manages socket connection lifecycle
├── Auto-connects on authentication
├── Auto-disconnects on logout
├── Joins conversation rooms on mount
├── Leaves rooms on unmount
├── Dispatches to socketSlice on connect/disconnect
└── Accepts event listeners as parameters
```

---

## 10. Cloudinary Media Management Architecture

### 10.1 Upload Flow Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐
│  CLIENT  │     │  SERVER  │     │  MULTER  │     │  CLOUDINARY  │
│ (React)  │     │ (Express)│     │ (Temp)   │     │   (CDN)      │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └──────┬───────┘
     │                │                │                   │
     │  1. User selects image(s)                         │
     │  2. Client-side preview & validation              │
     │     ├── Max 5 files                               │
     │     ├── Max 5MB each                              │
     │     └── Accepted: jpg, jpeg, png, webp            │
     │                                                  │
     │  3. POST /api/v1/upload/single (FormData)        │
     │────────────────►│                                │
     │                  │                                │
     │                  │  4. Multer stores temp file    │
     │                  │────────────────►│              │
     │                  │                                │
     │                  │  5. Upload to Cloudinary       │
     │                  │   ├── folder: 'petaverse/pets' │
     │                  │   ├── transformation:          │
     │                  │   │   ├── width: 1200          │
     │                  │   │   ├── quality: 'auto'      │
     │                  │   │   ├── fetch_format: 'auto' │
     │                  │   │   └── crop: 'limit'        │
     │                  │   └── tags: ['petaverse']      │
     │                  │────────────────────────────────────────►│
     │                  │                                │        │
     │                  │  6. Cloudinary returns:        │        │
     │                  │     { url, public_id,          │◄───────│
     │                  │       width, height, format }  │        │
     │                  │                                │
     │                  │  7. Delete temp file           │
     │                  │────────────────►│              │
     │                  │                                │
     │  8. Response: { url, publicId, width, height }   │
     │◄────────────────│                                │
     │                                                  │
     │  9. Store image data in pet form / profile form  │
     │  10. Submit form with image references            │
```

### 10.2 Image Transformation URL Patterns

```
Base URL: https://res.cloudinary.com/<cloud_name>/image/upload/

Transformation parameters (applied via URL):
├── w_400,h_300,c_fill,g_auto     → Thumbnail (PetCard)
├── w_800,c_limit,q_auto,f_auto   → Detail view
├── w_1200,c_limit,q_auto,f_auto  → Full size (lightbox)
├── w_200,h_200,c_fill,g_face     → Avatar (circular with face detection)
└── w_50,h_50,c_thumb,g_face      → Tiny thumbnail (nav bar)
```

### 10.3 Image Management API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload/single` | POST | Upload 1 image, returns Cloudinary data |
| `/upload/multiple` | POST | Upload up to 5 images, returns array of Cloudinary data |
| `/upload` | DELETE | Delete image from Cloudinary by `publicId` |

### 10.4 Cleanup Strategy

```
Image Cleanup Triggers:
├── Pet listing deleted  → Delete all associated images from Cloudinary
├── Pet listing updated  → Delete only removed images from Cloudinary
├── Profile picture changed → Delete old avatar from Cloudinary
└── Account deleted      → Delete avatar from Cloudinary

Prevention:
├── Validate image ownership before deletion
├── Only allow deletion of images belonging to the requesting user
└── Implement retry logic with exponential backoff for Cloudinary API failures
```

---

## 11. Deployment Architecture

### 11.1 Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CI/CD PIPELINE (GitHub Actions)                   │
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  PUSH TO │    │  LINT &  │    │  BUILD   │    │   DEPLOY     │  │
│  │  GITHUB  │───►│  TEST    │───►│  ASSETS  │───►│   TO HOST    │  │
│  │  (main)  │    │          │    │          │    │              │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────────┘  │
│                                                                      │
│  Steps:                                                              │
│  1. Checkout code                                                   │
│  2. Install dependencies (server + client)                          │
│  3. Run ESLint (server + client)                                    │
│  4. Run tests (Jest + Supertest for server)                         │
│  5. Build client (Vite build → dist/)                               │
│  6. Deploy server to Railway/Render                                 │
│  7. Upload client build to Vercel/Netlify (or serve via Express)    │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 Hosting Strategy (Recommended: Railway)

```
Option A: Railway (Recommended for MVP)
├── Single service for Express + static files
├── Automatic HTTPS
├── Built-in MongoDB Atlas integration
├── Environment variable management
├── Auto-deploy from GitHub
└── Cost-effective for MVP ($5/month starter)

Option B: Render
├── Web service for Express (free tier available)
├── Static site for React (free tier available)
├── Managed MongoDB Atlas (separate)
└── Good free tier for MVP testing

Option C: VPS (AWS EC2 / DigitalOcean Droplet)
├── Full control
├── Nginx reverse proxy + SSL (Let's Encrypt)
├── PM2 process manager for Node.js
├── MongoDB Atlas (managed) or self-hosted
└── Higher DevOps overhead
```

### 11.3 Environment Variables

```bash
# ─── Server Environment ───
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/petaverse

# JWT
ACCESS_TOKEN_SECRET=<random-64-char-string>
REFRESH_TOKEN_SECRET=<random-64-char-string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=<google-client-id>.apps.googleusercontent.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Redis
REDIS_URL=redis://<user>:<pass>@<host>:<port>

# Client URL (CORS)
CLIENT_URL=https://petaverse.vercel.app

# ─── Client Environment (Vite) ───
VITE_API_URL=https://api.petaverse.app/api/v1
VITE_GOOGLE_CLIENT_ID=<google-client-id>
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
```

### 11.4 Production Build Strategy

```
Client (Vite Build):
├── vite build outputs optimized static files to client/dist/
├── Assets hashed for cache busting ([name].[hash].js)
├── Code splitting per route (React.lazy)
├── Tailwind purges unused CSS
├── Images optimized (sharp/vite-imagetools)

Server:
├── Express serves API routes
├── Express also serves client/dist/ static files in production
├── Gzip compression (compression middleware)
├── Helmet security headers
└── Rate limiting via express-rate-limit + Redis store
```

### 11.5 Monitoring & Logging (Future Production)

```
Logging:
├── Morgan (dev) / Pino (production)
├── Structured JSON logging
├── Log levels: error, warn, info, debug
└── Future: Ship logs to external service (Logtail, Datadog)

Error Tracking:
├── Sentry.io (future integration)
├── Capture unhandled rejections + uncaught exceptions
└── Source maps for client errors

Health Checks:
├── GET /api/v1/health → { status: 'ok', timestamp, uptime }
├── MongoDB connection check
├── Redis connection check
└── Cloudinary API availability check
```

### 11.6 Scaling Roadmap (Post-MVP)

```
Phase 1 (MVP): Modular Monolith
└── Single Node.js process serving API + static files

Phase 2: Separate Static Hosting
└── React app on Vercel/Netlify (CDN edge), API on Railway

Phase 3: Horizontal Scaling
├── Multiple Node.js instances behind load balancer
├── Socket.io Redis adapter for cross-instance events
├── MongoDB Atlas auto-scaling

Phase 4: Service Extraction (if needed)
├── Extract chat → dedicated WebSocket service
├── Extract notifications → dedicated service
└── Keep core CRUD in monolith
```

---

## Appendix A: Development Environment Setup

```bash
# Prerequisites
Node.js >= 20.x
npm >= 10.x
MongoDB >= 7.x (local or Atlas)
Redis >= 7.x (local or Upstash)

# Local Development
1. Clone repository
2. cd server && npm install && npm run dev     # Express on :5000
3. cd client && npm install && npm run dev     # Vite on :5173
4. Vite proxy configured to forward /api to :5000
```

## Appendix B: Package Dependencies

### Server (`server/package.json`)

```
Dependencies:
├── express, mongoose, dotenv, cors, helmet, morgan
├── jsonwebtoken, google-auth-library
├── cloudinary, multer, multer-storage-cloudinary
├── ioredis, express-rate-limit, rate-limit-redis
├── socket.io
├── joi (validation)
└── cookie-parser

Dev Dependencies:
├── nodemon, eslint, prettier
└── jest, supertest, mongodb-memory-server
```

### Client (`client/package.json`)

```
Dependencies:
├── react, react-dom, react-router-dom
├── @reduxjs/toolkit, react-redux
├── @react-oauth/google
├── react-hook-form, @hookform/resolvers, zod
├── react-helmet-async
├── socket.io-client
├── react-hot-toast (or sonner)
└── clsx, tailwind-merge

Dev Dependencies:
├── vite, @vitejs/plugin-react
├── tailwindcss, postcss, autoprefixer
├── eslint, prettier
└── @types/react, @types/react-dom (for IDE intellisense only)
```

---

> **Document Status:** COMPLETE — Ready for implementation review.
> **Next Step:** Review architecture → Approve → Switch to Code mode for implementation.