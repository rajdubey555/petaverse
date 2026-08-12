import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiEdit, FiHeart, FiPackage } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { ROUTES } from '../../config/routes';
import UserAvatar from './UserAvatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const formatDate = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
};

const StatItem = ({ icon: Icon, label, value, to, className }) => {
    const content = (
        <div className={cn('flex flex-col items-center p-3', className)}>
            <Icon size={18} className="text-neutral-400 dark:text-neutral-500 mb-1" />
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {typeof value === 'number' ? value.toLocaleString() : value || 0}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {label}
            </span>
        </div>
    );

    if (to) {
        return (
            <Link
                to={to}
                className="block rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
                {content}
            </Link>
        );
    }

    return content;
};

const ProfileCard = ({
    user,
    isOwner = false,
    showStats = true,
    showActions = true,
    variant = 'default',
    className,
    ...props
}) => {
    if (!user) {
        return (
            <div
                className={cn(
                    'bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 text-center',
                    className
                )}
                {...props}
            >
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full mx-auto mb-3 animate-pulse" />
                <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-700 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-3 w-32 bg-neutral-100 dark:bg-neutral-700 rounded mx-auto animate-pulse" />
            </div>
        );
    }

    const {
        _id,
        name,
        email,
        avatar,
        bio,
        location,
        role,
        createdAt,
        listingCount,
        savedCount,
        isVerified,
    } = user;

    const memberSince = formatDate(createdAt);
    const locationDisplay = location
        ? [location.city, location.state].filter(Boolean).join(', ') || location.country
        : null;

    const variantClasses = {
        default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
        elevated: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg',
        minimal: 'bg-transparent',
    };

    return (
        <div
            className={cn(
                'rounded-2xl overflow-hidden',
                variantClasses[variant] || variantClasses.default,
                className
            )}
            {...props}
        >
            {/* Cover Area */}
            <div className="h-20 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-400" />

            {/* Avatar + Info */}
            <div className="px-5 pb-5">
                <div className="flex justify-between items-start">
                    <div className="-mt-10">
                        <UserAvatar
                            src={avatar?.url}
                            name={name}
                            size="2xl"
                            ringOnHover
                        />
                    </div>

                    {showActions && isOwner && (
                        <Link to={ROUTES.SETTINGS}>
                            <Button variant="outline" size="sm" leftIcon={FiEdit}>
                                Edit Profile
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Name + Role */}
                <div className="mt-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            {name || 'Unknown User'}
                        </h2>
                        {role === 'admin' && (
                            <Badge variant="accent" size="sm" dot>
                                Admin
                            </Badge>
                        )}
                        {isVerified && (
                            <Badge variant="primary" size="sm">
                                Verified
                            </Badge>
                        )}
                    </div>

                    {email && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {email}
                        </p>
                    )}
                </div>

                {/* Location */}
                {locationDisplay && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <FiMapPin size={13} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {locationDisplay}
                        </span>
                    </div>
                )}

                {/* Bio */}
                {bio && (
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {bio}
                    </p>
                )}

                {/* Member Since */}
                {memberSince && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <FiCalendar size={13} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Member since {memberSince}
                        </span>
                    </div>
                )}
            </div>

            {/* Stats */}
            {showStats && (
                <div className="border-t border-neutral-100 dark:border-neutral-700/50">
                    <div className="grid grid-cols-3 divide-x divide-neutral-100 dark:divide-neutral-700/50">
                        <StatItem
                            icon={FiPackage}
                            label="Listings"
                            value={listingCount ?? 0}
                            to={isOwner ? ROUTES.MY_LISTINGS : null}
                        />
                        <StatItem
                            icon={FiHeart}
                            label="Saved"
                            value={savedCount ?? 0}
                            to={isOwner ? ROUTES.SAVED_PETS : null}
                        />
                        <StatItem
                            icon={FiCalendar}
                            label="Member"
                            value={memberSince ? formatDate(createdAt).split(' ')[1] : '—'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ProfileCard);