import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiEye, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { SPECIES_CONFIG, SIZES, GENDERS, AGE_UNITS, LISTING_TYPES } from '../../config/constants';
import { ROUTES, build } from '../../config/routes';
import LazyImage from '../common/LazyImage';
import Badge from '../common/Badge';
import ListingTypeBadge from './ListingTypeBadge';
import SaveButton from './SaveButton';


const formatPetAge = (age) => {
  if (!age || !age.value) return null;
  const unit = age.unit || 'years';
  const unitLabel = AGE_UNITS.find((u) => u.value === unit)?.label || unit;
  const displayUnit = age.value === 1 ? unitLabel.replace(/s$/, '') : unitLabel;
  return `${age.value} ${displayUnit}`;
};

const formatPrice = (price, listingType) => {
  if (listingType === 'adoption' && !price) return 'Free Adoption';
  if (listingType === 'lost' || listingType === 'found') return null;
  if (!price && price !== 0) return null;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const getRelativeTime = (date) => {
  if (!date) return null;
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const PetCard = ({
  pet,
  isSaved = false,
  onSaveToggle,
  variant = 'default',
  index = 0,
  className,
  ...props
}) => {
  const {
    _id,
    name,
    species,
    breed,
    age,
    gender,
    size,
    listingType,
    status,
    price,
    isNegotiable,
    location,
    images = [],
    viewCount = 0,
    isFeatured = false,
    isVerified = false,
    createdAt,
  } = pet || {};

  const primaryImage = useMemo(() => {
    if (!images || images.length === 0) return null;
    const primary = images.find((img) => img.isPrimary);
    return primary || images[0];
  }, [images]);

  const speciesConfig = SPECIES_CONFIG[species] || SPECIES_CONFIG.dog;
  const sizeLabel = SIZES.find((s) => s.value === size)?.label || size;
  const genderLabel = GENDERS.find((g) => g.value === gender)?.label || gender;
  const listingTypeLabel = LISTING_TYPES.find((lt) => lt.value === listingType)?.label || listingType;
  const ageDisplay = formatPetAge(age);
  const priceDisplay = formatPrice(price, listingType);
  const relativeTime = getRelativeTime(createdAt);

  const isAdopted = status === 'adopted' || status === 'sold' || status === 'resolved';
  const isUrgent = listingType === 'lost' || status === 'pending';
  const isFeaturedCard = isFeatured && !isAdopted;

  const statusBadgeVariant = (() => {
    if (status === 'available') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'adopted' || status === 'sold' || status === 'resolved') return 'neutral';
    if (status === 'removed') return 'danger';
    return 'neutral';
  })();

  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Available';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden',
        'border border-neutral-200 dark:border-neutral-700',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        isFeaturedCard && 'ring-2 ring-accent-400 dark:ring-accent-500 ring-offset-2 dark:ring-offset-neutral-900',
        isUrgent && !isAdopted && 'border-red-300 dark:border-red-600',
        isAdopted && 'opacity-75',
        className
      )}
      {...props}
    >
      <Link
        to={build.petDetail(_id)}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
        aria-label={`View details for ${name || 'this pet'}`}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
          {primaryImage ? (
            <LazyImage
              src={primaryImage.url}
              alt={name || 'Pet image'}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{speciesConfig.emoji}</span>
            </div>
          )}

          {/* Adopted Overlay */}
          {isAdopted && (
            <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
              <span className="px-4 py-1.5 bg-white/90 dark:bg-neutral-800/90 rounded-full text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {status === 'adopted' ? 'Adopted' : status === 'sold' ? 'Sold' : 'Resolved'}
              </span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <ListingTypeBadge type={listingType} size="sm" />

            {isFeaturedCard && (
              <Badge variant="accent" size="sm" dot>
                Featured
              </Badge>
            )}

            {isUrgent && !isAdopted && (
              <Badge variant="danger" size="sm" pulse>
                {listingType === 'lost' ? 'Lost' : 'Urgent'}
              </Badge>
            )}

            {isVerified && (
              <Badge variant="primary" size="sm">
                Verified
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <div className="absolute top-3 right-3">
            <SaveButton
              petId={_id}
              isSaved={isSaved}
              onToggle={onSaveToggle}
              size="md"
              variant="icon"
            />
          </div>

          {/* Status Badge (bottom of image) */}
          {status && !isAdopted && (
            <div className="absolute bottom-3 left-3">
              <Badge variant={statusBadgeVariant} size="sm">
                {statusLabel}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Species & Breed */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm" aria-hidden="true">
              {speciesConfig.emoji}
            </span>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {speciesConfig.label}
            </span>
            {breed && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {breed}
                </span>
              </>
            )}
          </div>

          {/* Pet Name */}
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {name || 'Unnamed Pet'}
          </h3>

          {/* Location */}
          {location && (location.city || location.state) && (
            <div className="flex items-center gap-1 mb-2.5">
              <FiMapPin
                size={12}
                className="text-neutral-400 dark:text-neutral-500 flex-shrink-0"
              />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {[location.city, location.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Attributes Row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {ageDisplay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                <FiClock size={10} />
                {ageDisplay}
              </span>
            )}

            {gender && (
              <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                {genderLabel}
              </span>
            )}

            {sizeLabel && (
              <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                {sizeLabel}
              </span>
            )}
          </div>

          {/* Bottom Row: Price + View Count */}
          <div className="flex items-center justify-between">
            <div>
              {priceDisplay ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {priceDisplay}
                  </span>
                  {isNegotiable && listingType === 'sale' && (
                    <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-700/50 px-1.5 py-0.5 rounded">
                      Negotiable
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {listingType === 'adoption' ? 'Contact for details' : 'View details'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
              <FiEye size={12} />
              <span>{viewCount}</span>
            </div>
          </div>

          {/* Relative Time */}
          {relativeTime && (
            <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700/50">
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {relativeTime}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(PetCard);