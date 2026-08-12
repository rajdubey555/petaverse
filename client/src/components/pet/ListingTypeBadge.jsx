import { memo } from 'react';
import { FiHeart, FiHome, FiMapPin, FiHelpCircle } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const listingTypeConfig = {
  adoption: {
    icon: FiHeart,
    label: 'Adoption',
    baseClass: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/15 dark:text-primary-300 dark:border-primary-500/30',
  },
  rehoming: {
    icon: FiHome,
    label: 'Rehoming',
    baseClass: 'bg-secondary-50 text-secondary-700 border-secondary-200 dark:bg-secondary-500/15 dark:text-secondary-300 dark:border-secondary-500/30',
  },
  sale: {
    icon: null,
    label: 'For Sale',
    baseClass: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30',
  },
  lost: {
    icon: FiMapPin,
    label: 'Lost',
    baseClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
  },
  found: {
    icon: FiHelpCircle,
    label: 'Found',
    baseClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  },
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1',
  lg: 'px-2.5 py-1 text-sm gap-1.5',
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 14,
};

const ListingTypeBadge = ({ type, size = 'sm', showLabel = true, className, ...props }) => {
  const config = listingTypeConfig[type] || listingTypeConfig.adoption;

  if (!type) return null;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.baseClass,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      title={config.label}
      {...props}
    >
      {Icon && <Icon size={iconSizes[size] || iconSizes.md} />}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default memo(ListingTypeBadge);
export { listingTypeConfig };