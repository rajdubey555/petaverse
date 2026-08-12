const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Stores user accounts, Google OAuth data, refresh tokens, and profile info.
 *
 * Collection: users
 *
 * Key Design Decisions:
 * - refreshToken stored inline (no separate Token collection — free-tier optimization)
 * - refreshToken excluded from queries by default (select: false)
 * - Soft delete via isActive boolean
 * - unique sparse index on googleId (allows null for future email/pass auth)
 */
const userSchema = new mongoose.Schema(
    {
        // ── Authentication ──
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            select: false,
            minlength: [6, 'Password must be at least 6 characters long'],
        },

        // ── Refresh Token (Inline — replaces separate Token collection) ──
        refreshToken: {
            type: String,
            default: null,
            select: false,
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
                default: '',
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
            validate: {
                validator: function (v) {
                    if (!v) return true; // Allow empty
                    return /^[+]?[\d\s()-]{7,15}$/.test(v);
                },
                message: 'Please provide a valid phone number',
            },
        },
        location: {
            city: { type: String, default: '' },
            state: { type: String, default: '' },
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
            default: true,
        },
        ratings: [
            {
                reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                reviewerName: { type: String, default: 'User' },
                reviewerAvatar: { type: String, default: '' },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, default: '', maxlength: 500 },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Indexes ──
// { email: 1 }           — unique (auto-created by unique: true)
// { googleId: 1 }        — unique sparse (auto-created by unique: true + sparse: true)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// ── Virtuals ──

/** Virtual: Count of active listings by this user */
userSchema.virtual('listingCount', {
    ref: 'Pet',
    localField: '_id',
    foreignField: 'owner',
    count: true,
    match: { isActive: true },
});

/** Virtual: Count of pets saved by this user */
userSchema.virtual('savedCount', {
    ref: 'SavedPet',
    localField: '_id',
    foreignField: 'user',
    count: true,
});

/** Virtual: Average rating */
userSchema.virtual('averageRating').get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
});

/** Virtual: Rating count */
userSchema.virtual('ratingCount').get(function () {
    return this.ratings ? this.ratings.length : 0;
});

// ── Instance Methods ──

/**
 * Compare candidate password with stored hashed password.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if the stored refresh token is still valid (not expired).
 * @returns {boolean}
 */
userSchema.methods.hasValidRefreshToken = function () {
    return !!(
        this.refreshToken &&
        this.refreshTokenExpiresAt &&
        this.refreshTokenExpiresAt > new Date()
    );
};

/**
 * Clear the refresh token (used on logout).
 * @returns {Promise<Document>}
 */
userSchema.methods.clearRefreshToken = function () {
    this.refreshToken = null;
    this.refreshTokenExpiresAt = null;
    return this.save();
};

/**
 * Store a new refresh token.
 * @param {string} token - The refresh token JWT
 * @param {Date} expiresAt - Expiration date
 * @returns {Promise<Document>}
 */
userSchema.methods.setRefreshToken = function (token, expiresAt) {
    this.refreshToken = token;
    this.refreshTokenExpiresAt = expiresAt;
    return this.save();
};

// ── Statics ──

/**
 * Find existing user or create a new one from Google OAuth profile.
 * Updates profile picture and lastLoginAt on existing users.
 *
 * @param {Object} profile - Verified Google profile
 * @param {string} profile.googleId
 * @param {string} profile.email
 * @param {string} profile.name
 * @param {string} profile.picture
 * @returns {Promise<Document>} User document
 */
userSchema.statics.findOrCreateFromGoogle = async function (profile) {
    const { googleId, email, name, picture } = profile;

    let user = await this.findOne({
        $or: [{ googleId }, { email }],
    });

    if (user) {
        // Existing user — update profile if needed
        let changed = false;

        if (!user.googleId && googleId) {
            user.googleId = googleId;
            changed = true;
        }

        if (picture && user.avatar?.url !== picture) {
            user.avatar = { url: picture, publicId: '' };
            changed = true;
        }

        if (name && user.name !== name) {
            user.name = name;
            changed = true;
        }

        user.lastLoginAt = new Date();

        if (changed) {
            await user.save();
        } else {
            // Only update lastLoginAt when nothing else changed
            await this.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
        }

        return user;
    }

    // New user
    user = await this.create({
        googleId,
        email,
        name,
        avatar: { url: picture || '', publicId: '' },
        lastLoginAt: new Date(),
    });

    return user;
};

/**
 * Get public profile (safe fields only).
 * Excludes sensitive data.
 *
 * @param {string} userId
 * @returns {Promise<Object|null>} Public user profile or null
 */
userSchema.statics.getPublicProfile = async function (userId) {
    return this.findById(userId)
        .select('name avatar.url bio location role createdAt')
        .lean();
};

// ── Pre-save Hook ──

/** Hash password before saving if modified */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/** Ensure location fields are trimmed */
userSchema.pre('save', function (next) {
    if (this.isModified('location')) {
        if (this.location.city) this.location.city = this.location.city.trim();
        if (this.location.state) this.location.state = this.location.state.trim();
        if (this.location.country) this.location.country = this.location.country.trim();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;