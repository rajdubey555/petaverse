# 🐾 PetVerse MVP — MongoDB Schema Design

> **Tier:** Free-Tier MVP (MongoDB Atlas M0 — 512MB Storage)
> **Collections:** 3 Core Collections (User, Pet, SavedPet)
> **Strategy:** Launch-first, minimalist schema, embedded where appropriate, referenced where necessary

---

## Table of Contents

1. [Collection Overview](#1-collection-overview)
2. [User Collection](#2-user-collection)
3. [Pet Collection](#3-pet-collection)
4. [SavedPet Collection](#4-savedpet-collection)
5. [Index Strategy](#5-index-strategy)
6. [Data Size Estimation](#6-data-size-estimation)
7. [Mongoose Model Code References](#7-mongoose-model-code-references)

---

## 1. Collection Overview

```
petaverse (database)
│
├── users          ← User accounts, auth, profiles, roles
├── pets           ← All listing types (adoption, rehoming, sale, lost, found)
└── savedpets      ← User-to-Pet save junction (N:M relationship)
```

| Collection | Purpose | Est. Size/Doc | Est. Rows (1yr) | Index Overhead |
|-----------|---------|---------------|-----------------|----------------|
| `users` | User accounts & profiles | ~1 KB | 1,000 | ~0.3 MB |
| `pets` | All pet listings | ~3 KB | 5,000 | ~1.5 MB |
| `savedpets` | Saved pet bookmarks | ~0.1 KB | 10,000 | ~0.5 MB |
| **Total Est.** | | | | **~20 MB** (well within 512MB) |

---

## 2. User Collection

### 2.1 Schema Definition

```
Collection: users
Description: Stores user accounts, auth data, profile info, and roles.
             Refresh token stored inline (no separate Token collection).
```

#### Mongoose Schema Structure

```javascript
// models/User.js

const userSchema = new mongoose.Schema(
  {
    // ── Authentication ──
    googleId: {
      type: String,
      unique: true,
      sparse: true,           // Allows null for non-Google users (future email/pass)
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    // ── Refresh Token (stored inline, replaces Token collection) ──
    refreshToken: {
      type: String,
      default: null,          // null = logged out / no active session
      select: false,          // Never returned in queries by default
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    // ── Profile ──
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    avatar: {
      url: {
        type: String,
        default: '',           // Default avatar handled on frontend
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    phone: {
      type: String,
      default: '',
      match: [/^[+]?[\d\s()-]{7,15}$/, 'Please provide a valid phone number'],
    },
    location: {
      city:    { type: String, default: '' },
      state:   { type: String, default: '' },
      country: { type: String, default: '' },
    },

    // ── Role & Status ──
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,           // Soft delete: false = deactivated
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,          // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
```

### 2.2 Virtuals

```javascript
// Virtual: Count of active listings by this user
userSchema.virtual('listingCount', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner',
  count: true,
  match: { isActive: true },
});

// Virtual: Count of saved pets by this user
userSchema.virtual('savedCount', {
  ref: 'SavedPet',
  localField: '_id',
  foreignField: 'user',
  count: true,
});
```

### 2.3 Instance Methods

```javascript
// Check if refresh token is still valid
userSchema.methods.hasValidRefreshToken = function () {
  return (
    this.refreshToken &&
    this.refreshTokenExpiresAt &&
    this.refreshTokenExpiresAt > new Date()
  );
};

// Clear refresh token (logout)
userSchema.methods.clearRefreshToken = function () {
  this.refreshToken = null;
  this.refreshTokenExpiresAt = null;
  return this.save();
};
```

### 2.4 Statics

```javascript
// Find or create user from Google profile
userSchema.statics.findOrCreateFromGoogle = async function (profile) {
  const { sub: googleId, email, name, picture } = profile;

  let user = await this.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Existing user: update profile pic if changed, set googleId if missing
    if (!user.googleId) user.googleId = googleId;
    if (picture && user.avatar.url !== picture) {
      user.avatar.url = picture;
    }
    user.lastLoginAt = new Date();
    await user.save();
    return user;
  }

  // New user: create
  user = await this.create({
    googleId,
    email,
    name,
    avatar: { url: picture || '' },
    lastLoginAt: new Date(),
  });

  return user;
};
```

### 2.5 Indexes

| Index | Type | Purpose |
|-------|------|---------|
| `{ email: 1 }` | Unique | Login lookup, uniqueness |
| `{ googleId: 1 }` | Unique Sparse | Google OAuth lookup |
| `{ role: 1 }` | Regular | Admin user queries |
| `{ isActive: 1 }` | Regular | Active user filtering |

### 2.6 Query Patterns

| Query | Frequency | Use Case |
|-------|-----------|----------|
| `findOne({ email })` | High | Login, auth refresh |
| `findOne({ googleId })` | Medium | Google OAuth |
| `findById(id)` | High | Profile view, auth middleware |
| `findByIdAndUpdate(id, update)` | Low | Profile edit |
| `find({ role: 'admin', isActive: true })` | Low | Admin listing |

---

## 3. Pet Collection

### 3.1 Schema Definition

```
Collection: pets
Description: Single collection for ALL listing types.
             ListingType field distinguishes: adoption | rehoming | sale | lost | found.
             No separate collections per listing type — simpler queries, unified search.
```

#### Mongoose Schema Structure

```javascript
// models/Pet.js

const petSchema = new mongoose.Schema(
  {
    // ── Ownership ──
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pet must belong to an owner'],
      index: true,
    },

    // ── Basic Info ──
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: {
        values: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'],
        message: '{VALUE} is not a supported species',
      },
    },
    breed: {
      type: String,
      trim: true,
      default: '',
    },
    age: {
      value: {
        type: Number,
        required: [true, 'Age value is required'],
        min: [0, 'Age cannot be negative'],
      },
      unit: {
        type: String,
        required: [true, 'Age unit is required'],
        enum: ['days', 'weeks', 'months', 'years'],
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'xlarge'],
      default: 'medium',
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },

    // ── Health ──
    healthStatus: {
      vaccinated:   { type: Boolean, default: false },
      neutered:     { type: Boolean, default: false },
      microchipped: { type: Boolean, default: false },
      notes:        { type: String, maxlength: 500, default: '' },
    },

    // ── Listing Type & Status (Unified Sheet Architecture) ──
    listingType: {
      type: String,
      required: [true, 'Listing type is required'],
      enum: ['adoption', 'rehoming', 'sale', 'lost', 'found'],
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted', 'sold', 'resolved', 'removed'],
      default: 'available',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
      // Required only for 'sale' type — validated in pre-save hook
    },
    isNegotiable: {
      type: Boolean,
      default: true,
    },

    // ── Location ──
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
        default: '',
      },
      country: {
        type: String,
        trim: true,
        default: '',
      },
    },

    // ── Images (Embedded Subdocuments) ──
    images: [
      {
        url: {
          type: String,
          required: [true, 'Image URL is required'],
        },
        publicId: {
          type: String,
          required: [true, 'Cloudinary public_id is required'],
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ── Tags ──
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Maximum 10 tags allowed',
      },
    },

    // ── Contact ──
    contactInfo: {
      phone: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      preferredMethod: {
        type: String,
        enum: ['phone', 'email', 'platform'],
        default: 'platform',
      },
    },

    // ── Metadata ──
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,             // Soft delete
    },
    isVerified: {
      type: Boolean,
      default: false,            // Admin verification
    },
    isFeatured: {
      type: Boolean,
      default: false,            // Admin can feature
    },
  },
  {
    timestamps: true,            // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
```

### 3.2 Virtuals

```javascript
// Virtual: Number of users who saved this pet
petSchema.virtual('saveCount', {
  ref: 'SavedPet',
  localField: '_id',
  foreignField: 'pet',
  count: true,
});

// Virtual: Age as a human-readable string
petSchema.virtual('ageDisplay').get(function () {
  if (!this.age || !this.age.value) return 'Unknown';
  const unit = this.age.value === 1
    ? this.age.unit.replace(/s$/, '')   // "1 year" not "1 years"
    : this.age.unit;
  return `${this.age.value} ${unit}`;
});
```

### 3.3 Pre-Save Middleware

```javascript
// Validate price is set for 'sale' listings
petSchema.pre('save', function (next) {
  if (this.listingType === 'sale' && (!this.price || this.price <= 0)) {
    const err = new mongoose.Error.ValidationError();
    err.errors.price = new mongoose.Error.ValidatorError({
      message: 'Price is required for sale listings and must be greater than 0',
      path: 'price',
      value: this.price,
    });
    return next(err);
  }
  next();
});

// Ensure exactly one primary image
petSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const primaryCount = this.images.filter((img) => img.isPrimary).length;
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;   // First image becomes primary
    } else if (primaryCount > 1) {
      // Keep only the first as primary
      let found = false;
      this.images.forEach((img) => {
        if (img.isPrimary) {
          if (!found) { found = true; }
          else { img.isPrimary = false; }
        }
      });
    }
  }
  next();
});
```

### 3.4 Indexes

| Index | Type | Fields | Purpose |
|-------|------|--------|---------|
| `idx_owner` | Regular | `{ owner: 1 }` | User's listings |
| `idx_listing_status` | Compound | `{ listingType: 1, status: 1 }` | Browse by type + status |
| `idx_species_breed` | Compound | `{ species: 1, breed: 1 }` | Species/breed filter |
| `idx_type_city` | Compound | `{ listingType: 1, location.city: 1 }` | Type + location combo |
| `idx_status_created` | Compound | `{ status: 1, createdAt: -1 }` | Recent available |
| `idx_featured` | Compound | `{ isFeatured: 1, createdAt: -1 }` | Featured listings |
| `idx_text_search` | Text | `{ name: 'text', breed: 'text', description: 'text', tags: 'text' }` | Full-text search |

### 3.5 Query Patterns

| Query | Frequency | Use Case |
|-------|-----------|----------|
| `find({ listingType, status: 'available', ...filters }).sort('-createdAt').skip().limit()` | Very High | Public browsing |
| `findById(id).populate('owner', 'name email avatar.url')` | High | Pet detail page |
| `find({ owner: userId, isActive: true })` | Medium | My Listings |
| `find({ status: 'available', isVerified: false }).sort('createdAt')` | Low | Admin verification queue |
| `findByIdAndUpdate(id, { $inc: { viewCount: 1 } })` | Medium | View tracking (debounced) |
| `find({ $text: { $search: query } })` | Medium | Search |
| `find({ isFeatured: true, status: 'available' }).sort('-createdAt').limit(12)` | High | Homepage featured |

### 3.6 Listing Type → Status Lifecycle

```
┌─────────────┬──────────────────────────────────────────────────────────┐
│ ListingType │ Status Lifecycle                                          │
├─────────────┼──────────────────────────────────────────────────────────┤
│ adoption    │ available → pending → adopted                             │
│ rehoming    │ available → pending → adopted                             │
│ sale        │ available → pending → sold                                │
│ lost        │ available → resolved                                      │
│ found       │ available → resolved                                      │
├─────────────┴──────────────────────────────────────────────────────────┤
│ All types can be set to: removed (soft delete via isActive: false)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SavedPet Collection

### 4.1 Schema Definition

```
Collection: savedpets
Description: Junction collection for N:M relationship between users and pets.
             One document = one user saved one pet. Toggle pattern (create/delete).
```

#### Mongoose Schema Structure

```javascript
// models/SavedPet.js

const savedPetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },   // Only createdAt needed
  }
);
```

### 4.2 Compound Unique Index

```javascript
// A user can only save a pet once — prevents duplicates
savedPetSchema.index({ user: 1, pet: 1 }, { unique: true });
```

### 4.3 Statics (Toggle Pattern)

```javascript
// Toggle save/unsave — returns { saved: true/false, doc: SavedPet|null }
savedPetSchema.statics.toggle = async function (userId, petId) {
  const existing = await this.findOne({ user: userId, pet: petId });

  if (existing) {
    await existing.deleteOne();
    return { saved: false, doc: null };
  }

  const doc = await this.create({ user: userId, pet: petId });
  return { saved: true, doc };
};

// Check if a pet is saved by a user
savedPetSchema.statics.isSaved = async function (userId, petId) {
  const doc = await this.findOne({ user: userId, pet: petId });
  return !!doc;
};

// Get all saved pet IDs for a user (lightweight — returns only pet ObjectIds)
savedPetSchema.statics.getSavedPetIds = async function (userId) {
  const docs = await this.find({ user: userId }).select('pet').lean();
  return docs.map((d) => d.pet);
};
```

### 4.4 Indexes

| Index | Type | Fields | Purpose |
|-------|------|--------|---------|
| `idx_user_pet` | Unique Compound | `{ user: 1, pet: 1 }` | Prevent duplicates, toggle lookup |
| `idx_user` | Regular | `{ user: 1 }` | Get all saved pets for user |
| `idx_pet` | Regular | `{ pet: 1 }` | Count saves per pet |

### 4.5 Query Patterns

| Query | Frequency | Use Case |
|-------|-----------|----------|
| `findOne({ user, pet })` | High | Toggle check, isSaved check |
| `create({ user, pet })` | High | Save action |
| `deleteOne({ user, pet })` | High | Unsave action |
| `find({ user }).populate('pet')` | Medium | Saved Pets page |
| `countDocuments({ pet })` | Low | Save count on pet detail |

---

## 5. Index Strategy

### 5.1 Index Summary

```
DATABASE: petaverse (MongoDB Atlas M0 — Free Tier)

COLLECTION: users (4 indexes)
├── { email: 1 }                        UNIQUE
├── { googleId: 1 }                     UNIQUE (sparse)
├── { role: 1 }                         REGULAR
└── { isActive: 1 }                     REGULAR

COLLECTION: pets (7 indexes)
├── { owner: 1 }                        REGULAR
├── { listingType: 1, status: 1 }       COMPOUND
├── { species: 1, breed: 1 }            COMPOUND
├── { listingType: 1, location.city: 1 } COMPOUND
├── { status: 1, createdAt: -1 }        COMPOUND
├── { isFeatured: 1, createdAt: -1 }    COMPOUND
└── { name: 'text', breed: 'text',      TEXT
      description: 'text', tags: 'text' }

COLLECTION: savedpets (3 indexes)
├── { user: 1, pet: 1 }                 UNIQUE COMPOUND
├── { user: 1 }                         REGULAR
└── { pet: 1 }                          REGULAR
```

### 5.2 Index Memory Estimation (Free Tier Limit: 512MB)

| Collection | Indexes | Est. Size |
|-----------|---------|-----------|
| users | 4 indexes | ~0.2 MB |
| pets | 7 indexes (incl. text) | ~2.0 MB |
| savedpets | 3 indexes | ~0.5 MB |
| **Total** | **14 indexes** | **~2.7 MB** ✅ |

> **Note:** MongoDB Atlas M0 free tier allows indexes. With estimated 5,000 pets and 1,000 users, total data + indexes stays well under 50MB, leaving ample room within the 512MB limit.

---

## 6. Data Size Estimation

### 6.1 Per-Document Size Breakdown

#### User Document (~1 KB)
```
_id:            12 B (ObjectId)
googleId:       25 B (string)
email:          40 B (string)
refreshToken:  200 B (JWT string, ~180 chars)
refreshTokenExpiresAt: 8 B (Date)
name:           50 B (string)
avatar:        120 B ({ url: String, publicId: String })
bio:           300 B (avg string)
phone:          15 B (string)
location:       80 B ({ city, state, country })
role:            5 B ('user'/'admin')
isActive:        1 B (Boolean)
lastLoginAt:     8 B (Date)
createdAt:       8 B (Date)
updatedAt:       8 B (Date)
─────────────────────
Total:        ~880 B → round to ~1 KB
```

#### Pet Document (~3 KB with 3 images)
```
_id:            12 B (ObjectId)
owner:          12 B (ObjectId — ref)
name:           40 B (string)
species:         8 B (string)
breed:          20 B (string)
age:            12 B ({ value: Number, unit: String })
gender:          6 B (string)
size:            6 B (string)
color:          10 B (string)
description:   400 B (avg string)
healthStatus:   15 B ({ 3 booleans + short notes })
listingType:    10 B (string)
status:         10 B (string)
price:           8 B (Number)
isNegotiable:    1 B (Boolean)
location:       60 B ({ city, state, country })
images:      3 × 100 B = 300 B (each: { url: 70B, publicId: 25B, isPrimary: 1B })
tags:           50 B (avg 3-4 tags)
contactInfo:    60 B ({ phone, email, preferredMethod })
viewCount:       8 B (Number)
isActive:        1 B (Boolean)
isVerified:      1 B (Boolean)
isFeatured:      1 B (Boolean)
createdAt:       8 B (Date)
updatedAt:       8 B (Date)
─────────────────────
Total:      ~1,057 B → round to ~1.5 KB (with BSON overhead ~3 KB)
```

#### SavedPet Document (~80 B)
```
_id:            12 B (ObjectId)
user:           12 B (ObjectId — ref)
pet:            12 B (ObjectId — ref)
createdAt:       8 B (Date)
─────────────────────
Total:        ~44 B → round to ~80 B (BSON overhead)
```

### 6.2 Growth Projection

| Timeframe | Users | Pets | SavedPets | Total Data |
|-----------|-------|------|-----------|------------|
| Launch | 50 | 100 | 200 | ~0.5 MB |
| Month 3 | 500 | 1,000 | 3,000 | ~4 MB |
| Month 6 | 1,000 | 3,000 | 8,000 | ~12 MB |
| Year 1 | 2,000 | 5,000 | 15,000 | ~20 MB |
| Year 2 | 5,000 | 12,000 | 40,000 | ~50 MB |

> ✅ **Free tier (512MB) comfortably supports Year 2 projections.**

---

## 7. Mongoose Model Code References

### 7.1 File Map

```
server/src/models/
├── User.js           ← User schema (auth, profile, refresh token inline)
├── Pet.js            ← Unified pet listing schema (all 5 listing types)
└── SavedPet.js       ← Junction collection (toggle save/unsave)
```

### 7.2 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Single `pets` collection for all listing types** | Simplifies search across types, unified filtering, fewer indexes, simpler API |
| **`listingType` enum over separate collections** | Avoids collection proliferation, easy to add new types, unified query builder |
| **Refresh token on `User` doc (not separate collection)** | Eliminates a collection, simpler logout (null field), fewer queries, fits free tier |
| **`images` as embedded subdocuments** | Images always queried with pet, max 5 images — no benefit to separate collection |
| **`SavedPet` as separate collection (not embedded in User)** | User could save hundreds of pets; embedding would bloat User doc beyond 16MB limit |
| **No `select: false` on sensitive fields except tokens** | Keeps queries simple; auth filtering done at application layer |
| **Timestamps on all collections** | `createdAt` needed for sorting/display; `updatedAt` for cache busting |
| **Soft delete (`isActive: Boolean`)** | Data recovery, analytics, no accidental data loss on free tier |
| **Text index on `pets`** | Built-in MongoDB full-text search — no need for Elasticsearch/Algolia on MVP |
| **No geospatial index (yet)** | Adds index overhead; can be added later when location search becomes a feature |

### 7.3 Data Integrity Rules

```
1. USER
   ├── email: unique, lowercase, validated format
   ├── googleId: unique, sparse (null allowed)
   ├── refreshToken: null on logout, auto-cleared after 7 days
   └── role: only 'user' or 'admin'

2. PET
   ├── listingType === 'sale' → price required & > 0
   ├── images: max 1 primary (enforced in pre-save)
   ├── images: if none marked primary → first auto-set as primary
   ├── images: if >5 uploaded → rejected at API validation layer
   └── isActive: false = soft deleted (never hard delete)

3. SAVEDPET
   ├── { user, pet } compound unique → no duplicate saves
   ├── Cascade: when Pet deleted → all SavedPets for that pet remain
   │   (handled at query time: only show saved for isActive pets)
   └── Cascade: when User deleted → all SavedPets for that user remain
       (cleanup not critical for MVP; can add later)
```

---

> **Document Status:** COMPLETE — Ready for [`User.js`](server/src/models/User.js), [`Pet.js`](server/src/models/Pet.js), [`SavedPet.js`](server/src/models/SavedPet.js) implementation.
> **Next Step:** Generate Mongoose model files in Code mode.