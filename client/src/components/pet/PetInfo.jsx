import { memo } from 'react';
import {
    FiClock,
    FiMapPin,
    FiHeart,
    FiActivity,
    FiShield,
    FiTag,
    FiCalendar,
    FiInfo,
} from 'react-icons/fi';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { cn } from '../../utils/cn';
import { SPECIES_CONFIG, SIZES, GENDERS, AGE_UNITS, LISTING_TYPES } from '../../config/constants';
import Badge from '../common/Badge';
import ListingTypeBadge from './ListingTypeBadge';

const formatAge = (age) => {
    if (!age || !age.value) return 'N/A';
    const unit = age.unit || 'years';
    const unitLabel = AGE_UNITS.find((u) => u.value === unit)?.label || unit;
    const displayUnit = age.value === 1 ? unitLabel.replace(/s$/, '') : unitLabel;
    return `${age.value} ${displayUnit}`;
};

const formatPrice = (price, listingType) => {
    if (listingType === 'adoption' && !price) return 'Free Adoption';
    if (listingType === 'lost' || listingType === 'found') return 'N/A';
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

const InfoItem = ({ icon: Icon, label, value, className }) => (
    <div className={cn('flex items-start gap-3', className)}>
        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={16} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="min-w-0">
            <dt className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
                {label}
            </dt>
            <dd className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-0.5 break-words">
                {value}
            </dd>
        </div>
    </div>
);

const PetInfo = ({ pet, className, ...props }) => {
    if (!pet) {
        return (
            <div className={cn('text-center py-8', className)} {...props}>
                <p className="text-neutral-500 dark:text-neutral-400">No pet information available.</p>
            </div>
        );
    }

    const {
        name,
        species,
        breed,
        age,
        gender,
        size,
        color,
        listingType,
        status,
        price,
        isNegotiable,
        location,
        description,
        healthStatus,
        tags = [],
        viewCount = 0,
        createdAt,
        updatedAt,
    } = pet;

    const speciesConfig = SPECIES_CONFIG[species];
    const sizeLabel = SIZES.find((s) => s.value === size)?.label || size;
    const genderLabel = GENDERS.find((g) => g.value === gender)?.label || gender;
    const listingTypeLabel = LISTING_TYPES.find((lt) => lt.value === listingType)?.label || listingType;
    const ageDisplay = formatAge(age);
    const priceDisplay = formatPrice(price, listingType);
    const locationDisplay = location
        ? [location.city, location.state, location.country].filter(Boolean).join(', ')
        : 'N/A';

    const statusBadgeVariant = (() => {
        if (status === 'available') return 'success';
        if (status === 'pending') return 'warning';
        if (status === 'adopted' || status === 'sold' || status === 'resolved') return 'neutral';
        if (status === 'removed') return 'danger';
        return 'neutral';
    })();

    return (
        <div className={cn('space-y-6', className)} {...props}>
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <ListingTypeBadge type={listingType} size="md" />
                    {status && (
                        <Badge variant={statusBadgeVariant} size="md" dot>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {name || 'Unnamed Pet'}
                </h1>

                {speciesConfig && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
                        <span>{speciesConfig.emoji}</span>
                        <span>{speciesConfig.label}</span>
                        {breed && (
                            <>
                                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                                <span>{breed}</span>
                            </>
                        )}
                    </p>
                )}
            </div>

            {/* Price + Negotiable */}
            {priceDisplay && priceDisplay !== 'N/A' && (
                <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-500/10 rounded-2xl border border-primary-100 dark:border-primary-500/20">
                    {listingType === 'adoption' ? (
                        <span className="text-xl">🐾</span>
                    ) : (
                        <FaIndianRupeeSign size={18} className="text-primary-600 dark:text-primary-400" />
                    )}
                    <div>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {priceDisplay}
                        </span>
                        {isNegotiable && listingType === 'sale' && (
                            <span className="ml-2.5 px-2.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                Negotiable
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Key Details Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ageDisplay !== 'N/A' && (
                    <InfoItem icon={FiClock} label="Age" value={ageDisplay} />
                )}

                {genderLabel && (
                    <InfoItem icon={FiHeart} label="Gender" value={genderLabel} />
                )}

                {sizeLabel && (
                    <InfoItem icon={FiActivity} label="Size" value={sizeLabel} />
                )}

                {color && (
                    <InfoItem
                        icon={FiInfo}
                        label="Color"
                        value={
                            <span className="flex items-center gap-2">
                                <span
                                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-600 inline-block"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                                {color}
                            </span>
                        }
                    />
                )}

                <InfoItem icon={FiMapPin} label="Location" value={locationDisplay} />

                {createdAt && (
                    <InfoItem icon={FiCalendar} label="Listed On" value={formatDate(createdAt)} />
                )}
            </dl>

            {/* Health Status */}
            {healthStatus && (
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                        <FiShield size={16} className="text-green-600 dark:text-green-400" />
                        Health Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {healthStatus.vaccinated && (
                            <Badge variant="success" size="sm">
                                Vaccinated
                            </Badge>
                        )}
                        {healthStatus.neutered && (
                            <Badge variant="info" size="sm">
                                Neutered / Spayed
                            </Badge>
                        )}
                        {healthStatus.microchipped && (
                            <Badge variant="info" size="sm">
                                Microchipped
                            </Badge>
                        )}
                    </div>
                    {healthStatus.notes && (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {healthStatus.notes}
                        </p>
                    )}
                </div>
            )}

            {/* Description */}
            {description && (
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                        <FiInfo size={16} className="text-neutral-500 dark:text-neutral-400" />
                        About
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                        <FiTag size={16} className="text-neutral-500 dark:text-neutral-400" />
                        Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, index) => (
                            <Badge key={index} variant="neutral" size="sm">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* View Count */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700/50">
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {viewCount} view{viewCount !== 1 ? 's' : ''}
                    {updatedAt && ` · Updated ${formatDate(updatedAt)}`}
                </p>
            </div>
        </div>
    );
};

export default memo(PetInfo);