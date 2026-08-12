import { memo } from 'react';
import { FiStar, FiEye, FiTrash2, FiImage, FiExternalLink } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { formatDate, formatPrice } from '../../utils/formatters';
import { SPECIES_CONFIG } from '../../config/constants';
import Badge from '../common/Badge';
import ListingTypeBadge from '../pet/ListingTypeBadge';

const statusBadgeVariant = {
    available: 'success',
    adopted: 'accent',
    rehomed: 'accent',
    sold: 'neutral',
    pending: 'warning',
    removed: 'error',
};

const PetRow = ({
    pet,
    index,
    onFeature,
    onDelete,
    onView,
    isTogglingFeature = false,
    isDeleting = false,
}) => {
    const speciesConfig = SPECIES_CONFIG[pet.species] || SPECIES_CONFIG.other;
    const listingType = pet.listingType || 'adoption';
    const status = pet.status || 'available';

    const handleFeature = () => {
        if (onFeature) onFeature(pet._id);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(pet._id);
    };

    return (
        <tr
            className={cn(
                'transition-colors duration-150 border-b border-neutral-100 dark:border-neutral-800/60',
                'hover:bg-amber-50/40 dark:hover:bg-neutral-800/60',
                !pet.isActive && 'bg-red-50/20 dark:bg-red-950/10'
            )}
        >
            {/* Image + Pet Name + Breed */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-xs">
                        {pet.images?.[0]?.url ? (
                            <img
                                src={pet.images[0].url}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                                {speciesConfig.icon}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[180px]">
                            {pet.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                            <span>{speciesConfig.icon}</span>
                            <span className="truncate max-w-[160px]">{pet.breed || speciesConfig.label}</span>
                        </p>
                    </div>
                </div>
            </td>

            {/* Listing Type */}
            <td className="px-5 py-4">
                <ListingTypeBadge type={listingType} size="sm" />
            </td>

            {/* Price */}
            <td className="px-5 py-4">
                <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-neutral-100">
                    {pet.price ? formatPrice(pet.price) : 'Free / Adoption'}
                </span>
                {pet.isNegotiable && (
                    <span className="text-[10px] text-neutral-400 ml-1 font-medium">(Neg.)</span>
                )}
            </td>

            {/* Owner */}
            <td className="px-5 py-4">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[130px] block">
                    {pet.owner?.name || 'Unknown Owner'}
                </span>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <Badge
                    variant={statusBadgeVariant[status] || 'neutral'}
                    size="sm"
                    dot
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            </td>

            {/* Featured */}
            <td className="px-5 py-4 text-center">
                <button
                    type="button"
                    onClick={handleFeature}
                    disabled={isTogglingFeature}
                    className={cn(
                        'p-2 rounded-xl transition-all',
                        pet.isFeatured
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs'
                            : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                    title={pet.isFeatured ? 'Unfeature this listing' : 'Promote/Feature this listing'}
                >
                    <FiStar className={cn('w-4 h-4', pet.isFeatured && 'fill-current text-amber-500')} />
                </button>
            </td>

            {/* Views */}
            <td className="px-5 py-4 text-center">
                <span className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                    {pet.viewCount ?? 0}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView?.(pet._id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all flex items-center gap-1"
                        aria-label={`View ${pet.name}`}
                    >
                        <span>View</span>
                        <FiExternalLink className="w-3 h-3" />
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-all disabled:opacity-50"
                        aria-label={`Delete ${pet.name}`}
                        title="Delete listing"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default memo(PetRow);