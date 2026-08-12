const mongoose = require('mongoose');

/**
 * Pet Model
 * Unified collection for ALL listing types: adoption, rehoming, sale, lost, found.
 * The listingType field distinguishes between them.
 *
 * Collection: pets
 *
 * Key Design Decisions:
 * - Single collection for all listing types (unified search, fewer indexes)
 * - Images embedded as subdocuments (always queried with pet, max 5)
 * - Soft delete via isActive boolean
 * - Admin verification via isVerified boolean
 * - Text index for full-text search
 */
const petSchema = new mongoose.Schema(
    {
        // ── Ownership ──
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Pet must have an owner'],
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
                enum: {
                    values: ['days', 'weeks', 'months', 'years'],
                    message: '{VALUE} is not a valid age unit',
                },
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
            vaccinated: { type: Boolean, default: false },
            neutered: { type: Boolean, default: false },
            microchipped: { type: Boolean, default: false },
            notes: {
                type: String,
                maxlength: [500, 'Health notes cannot exceed 500 characters'],
                default: '',
            },
        },

        // ── Listing Type & Status ──
        listingType: {
            type: String,
            required: [true, 'Listing type is required'],
            enum: {
                values: ['adoption', 'rehoming', 'sale', 'lost', 'found'],
                message: '{VALUE} is not a valid listing type',
            },
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
                validator: function (v) {
                    return v.length <= 10;
                },
                message: 'Maximum 10 tags allowed',
            },
        },

        // ── Contact ──
        contactInfo: {
            phone: { type: String, default: '' },
            email: { type: String, default: '' },
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
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Indexes ──
petSchema.index({ listingType: 1, status: 1 });
petSchema.index({ species: 1, breed: 1 });
petSchema.index({ listingType: 1, 'location.city': 1 });
petSchema.index({ status: 1, createdAt: -1 });
petSchema.index({ isActive: 1, listingType: 1, species: 1, status: 1 });
petSchema.index({ owner: 1, isActive: 1 });
petSchema.index({ viewCount: -1 });
petSchema.index({ isFeatured: 1, createdAt: -1 });
petSchema.index(
    { name: 'text', breed: 'text', description: 'text', tags: 'text' },
    { weights: { name: 10, breed: 5, tags: 3, description: 1 } }
);

// ── Virtuals ──

/** Virtual: Human-readable age display */
petSchema.virtual('ageDisplay').get(function () {
    if (!this.age || !this.age.value) return 'Unknown';
    const suffix = this.age.value === 1
        ? this.age.unit.replace(/s$/, '')
        : this.age.unit;
    return `${this.age.value} ${suffix}`;
});

/** Virtual: Number of users who saved this pet */
petSchema.virtual('saveCount', {
    ref: 'SavedPet',
    localField: '_id',
    foreignField: 'pet',
    count: true,
});

/** Virtual: Primary image URL (or first image as fallback) */
petSchema.virtual('primaryImage').get(function () {
    if (!this.images || this.images.length === 0) return null;
    const primary = this.images.find((img) => img.isPrimary);
    return primary || this.images[0];
});

// ── Pre-save Middleware ──

/**
 * Validate price for sale listings.
 */
petSchema.pre('save', function (next) {
    if (this.listingType === 'sale' && (!this.price || this.price <= 0)) {
        const err = new mongoose.Error.ValidationError(this);
        err.errors.price = new mongoose.Error.ValidatorError({
            message: 'Price is required for sale listings and must be greater than 0',
            path: 'price',
            value: this.price,
        });
        return next(err);
    }
    next();
});

/**
 * Ensure exactly one primary image when images are provided.
 */
petSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const primaryCount = this.images.filter((img) => img.isPrimary).length;

        if (primaryCount === 0) {
            this.images[0].isPrimary = true;
        } else if (primaryCount > 1) {
            let found = false;
            this.images.forEach((img) => {
                if (img.isPrimary) {
                    if (!found) {
                        found = true;
                    } else {
                        img.isPrimary = false;
                    }
                }
            });
        }
    }
    next();
});

/**
 * Trim string fields before saving.
 */
petSchema.pre('save', function (next) {
    if (this.isModified('location')) {
        if (this.location.city) this.location.city = this.location.city.trim();
        if (this.location.state) this.location.state = this.location.state.trim();
        if (this.location.country) this.location.country = this.location.country.trim();
    }
    next();
});

// ── Statics ──

/**
 * Get featured (admin-promoted) listings.
 *
 * @param {number} [limit=12]
 * @returns {Promise<Array>}
 */
petSchema.statics.getFeatured = function (limit = 48) {
    const numLimit = typeof limit === 'object' && limit !== null && limit.limit ? Number(limit.limit) : Number(limit) || 48;
    return this.find({ isFeatured: true, isActive: true, status: 'available' })
        .sort({ createdAt: -1 })
        .limit(numLimit)
        .populate('owner', 'name avatar.url location.city');
};

/**
 * Increment view count for a pet listing.
 * Uses $inc to avoid race conditions.
 *
 * @param {string} petId
 * @returns {Promise<Object|null>}
 */
petSchema.statics.incrementView = function (petId) {
    return this.findByIdAndUpdate(
        petId,
        { $inc: { viewCount: 1 } },
        { new: true, select: 'viewCount' }
    );
};

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;