const { PAGINATION } = require('./constants');

/**
 * API Features — Reusable Query Builder
 *
 * Provides a consistent pattern for filtering, sorting, field limiting,
 * searching, and pagination across all list endpoints.
 *
 * Usage in a controller:
 *   const features = new APIFeatures(Model.find(), req.query)
 *     .filter()
 *     .search()
 *     .sort()
 *     .limitFields()
 *     .paginate();
 *   const docs = await features.query;
 */
class APIFeatures {
    /**
     * @param {mongoose.Query} query - Mongoose query object
     * @param {Object} queryString - req.query from Express
     */
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * Filter by query parameters (excluding reserved params).
     * Supports MongoDB operators: gte, gt, lte, lt, in
     * Example: ?species=dog&age[gte]=2&price[lte]=500
     */
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = [
            'page', 'limit', 'sort', 'fields',
            'search', 'populate', 'select',
        ];

        excludedFields.forEach((field) => delete queryObj[field]);

        // Remove empty string or undefined query params
        Object.keys(queryObj).forEach((key) => {
            if (queryObj[key] === '' || queryObj[key] === null || queryObj[key] === undefined) {
                delete queryObj[key];
            }
        });

        // Handle comma-separated values: ?listingType=lost,found → { listingType: { $in: ['lost', 'found'] } }
        Object.keys(queryObj).forEach((key) => {
            if (typeof queryObj[key] === 'string' && queryObj[key].includes(',')) {
                queryObj[key] = { in: queryObj[key].split(',') };
            }
        });

        // Handle nested location (city, state)
        if (queryObj.city) {
            queryObj['location.city'] = new RegExp(queryObj.city.trim(), 'i');
            delete queryObj.city;
        }
        if (queryObj.state) {
            queryObj['location.state'] = new RegExp(queryObj.state.trim(), 'i');
            delete queryObj.state;
        }

        // Handle nested healthStatus flags
        if (queryObj.vaccinated !== undefined) {
            queryObj['healthStatus.vaccinated'] = queryObj.vaccinated === 'true' || queryObj.vaccinated === true;
            delete queryObj.vaccinated;
        }
        if (queryObj.neutered !== undefined) {
            queryObj['healthStatus.neutered'] = queryObj.neutered === 'true' || queryObj.neutered === true;
            delete queryObj.neutered;
        }

        // Handle boolean parameters
        if (queryObj.isFeatured !== undefined) {
            queryObj.isFeatured = queryObj.isFeatured === 'true' || queryObj.isFeatured === true;
        }
        if (queryObj.isVerified !== undefined) {
            queryObj.isVerified = queryObj.isVerified === 'true' || queryObj.isVerified === true;
        }

        // Handle owner filter (Mongoose ObjectId validation)
        if (queryObj.owner) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(queryObj.owner)) {
                queryObj.owner = new mongoose.Types.ObjectId(queryObj.owner);
            }
        }

        // Handle priceMin & priceMax parameters if provided
        if (queryObj.priceMin !== undefined || queryObj.priceMax !== undefined) {
            queryObj.price = queryObj.price || {};
            if (queryObj.priceMin !== undefined && queryObj.priceMin !== '') {
                queryObj.price.gte = Number(queryObj.priceMin);
                delete queryObj.priceMin;
            }
            if (queryObj.priceMax !== undefined && queryObj.priceMax !== '') {
                queryObj.price.lte = Number(queryObj.priceMax);
                delete queryObj.priceMax;
            }
        }

        // Handle range operators: ?age[gte]=2 → { age: { $gte: 2 } }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|in|ne|nin)\b/g,
            (match) => `$${match}`
        );

        // Add isActive filter for soft-delete support ONLY if model schema contains isActive field
        const filters = JSON.parse(queryStr);
        if (filters.isActive === undefined && this.query.model?.schema?.path('isActive')) {
            filters.isActive = true;
        }

        // Convert string ObjectId fields to real Mongoose ObjectIds AFTER JSON.parse!
        if (filters.owner) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(filters.owner)) {
                filters.owner = new mongoose.Types.ObjectId(filters.owner);
            }
        }

        this.query = this.query.find(filters);
        return this;
    }

    /**
     * Search across name, breed, species, city, state, description.
     */
    search() {
        if (this.queryString.search) {
            const regex = new RegExp(this.queryString.search.trim(), 'i');
            this.query = this.query.find({
                $or: [
                    { name: regex },
                    { breed: regex },
                    { species: regex },
                    { 'location.city': regex },
                    { 'location.state': regex },
                    { description: regex },
                ],
            });
        }
        return this;
    }

    /**
     * Sort by field(s).
     * Example: ?sort=-createdAt,name
     * Default: -createdAt (newest first)
     */
    sort() {
        const sortBy = this.queryString.sort
            ? this.queryString.sort.split(',').join(' ')
            : '-createdAt';

        this.query = this.query.sort(sortBy);
        return this;
    }

    /**
     * Limit returned fields (projection).
     * Example: ?fields=name,breed,age,images
     */
    limitFields() {
        const fields = this.queryString.fields
            ? this.queryString.fields.split(',').join(' ')
            : '-__v'; // Exclude __v by default

        this.query = this.query.select(fields);
        return this;
    }

    /**
     * Paginate results.
     * Example: ?page=2&limit=12
     * Defaults: page=1, limit=12, max limit=50
     */
    paginate() {
        const page = Math.max(1, parseInt(this.queryString.page, 10)) || PAGINATION.DEFAULT_PAGE;
        const limit = Math.min(
            Math.max(1, parseInt(this.queryString.limit, 10)) || PAGINATION.DEFAULT_LIMIT,
            PAGINATION.MAX_LIMIT
        );
        const skip = (page - 1) * limit;

        // Store pagination info on the instance for use by controllers
        this.paginationInfo = { page, limit };
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    /**
     * Populate referenced fields.
     * Example: ?populate=owner
     */
    populate() {
        if (this.queryString.populate) {
            const fields = this.queryString.populate.split(',').join(' ');
            this.query = this.query.populate(fields);
        }
        return this;
    }

    /**
     * Execute the query and return pagination metadata alongside results.
     * @param {mongoose.Model} Model - The Mongoose model (for countDocuments)
     * @param {Object} baseFilter - Base filter to apply for count (e.g., { isActive: true })
     * @returns {Promise<{ data: Array, pagination: Object }>}
     */
    async executeWithCount(Model, baseFilter = {}) {
        // Build count filter from the original query conditions
        const countFilter = { ...baseFilter, ...this.query._conditions };
        // Ensure isActive is included in count ONLY if Model schema actually has an isActive field
        if (countFilter.isActive === undefined && Model?.schema?.path('isActive')) {
            countFilter.isActive = true;
        }

        const totalResults = await Model.countDocuments(countFilter);

        const { page, limit } = this.paginationInfo || {
            page: PAGINATION.DEFAULT_PAGE,
            limit: PAGINATION.DEFAULT_LIMIT,
        };
        const totalPages = Math.ceil(totalResults / limit) || 1;

        const data = await this.query;

        return {
            data,
            pagination: {
                page,
                limit,
                totalPages,
                totalResults,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
}

module.exports = APIFeatures;