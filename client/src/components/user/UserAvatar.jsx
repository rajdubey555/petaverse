import { memo, useMemo } from 'react';
import { FiUser } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import LazyImage from '../common/LazyImage';

const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
};

const iconSizes = {
    xs: 10,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
};

const statusDotSizes = {
    xs: 'w-1.5 h-1.5 right-0 -bottom-0.5',
    sm: 'w-2 h-2 right-0.5 bottom-0',
    md: 'w-2.5 h-2.5 right-0.5 bottom-0',
    lg: 'w-3 h-3 right-0.5 bottom-0.5',
    xl: 'w-3.5 h-3.5 right-1 bottom-1',
    '2xl': 'w-4 h-4 right-1 bottom-1',
    '3xl': 'w-4 h-4 right-1.5 bottom-1.5',
};

const ringSizes = {
    xs: 'ring-1',
    sm: 'ring-1',
    md: 'ring-2',
    lg: 'ring-2',
    xl: 'ring-3',
    '2xl': 'ring-3',
    '3xl': 'ring-4',
};

const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-neutral-400 dark:bg-neutral-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
};

const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getColorFromName = (name) => {
    const colors = [
        'bg-primary-500',
        'bg-secondary-500',
        'bg-accent-500',
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-teal-500',
        'bg-orange-500',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const UserAvatar = ({
    src,
    alt,
    name,
    size = 'md',
    status,
    showStatus = false,
    ringOnHover = false,
    isInteractive = false,
    className,
    ...props
}) => {
    const initials = useMemo(() => getInitials(name), [name]);
    const bgColor = useMemo(() => getColorFromName(name), [name]);

    const hasImage = !!src;

    const avatarContent = hasImage ? (
        <LazyImage
            src={src}
            alt={alt || name || 'User avatar'}
            className={cn(
                'w-full h-full rounded-full object-cover',
                ringOnHover && 'group-hover:ring-2 group-hover:ring-primary-500/50'
            )}
            objectFit="cover"
        />
    ) : (
        <div
            className={cn(
                'w-full h-full rounded-full flex items-center justify-center',
                bgColor,
                ringOnHover && 'group-hover:ring-2 group-hover:ring-primary-500/50'
            )}
        >
            {initials ? (
                <span
                    className={cn(
                        'font-semibold text-white select-none',
                        size === 'xs' && 'text-[7px]',
                        size === 'sm' && 'text-[9px]',
                        size === 'md' && 'text-xs',
                        size === 'lg' && 'text-sm',
                        size === 'xl' && 'text-base',
                        size === '2xl' && 'text-lg',
                        size === '3xl' && 'text-xl'
                    )}
                >
                    {initials}
                </span>
            ) : (
                <FiUser
                    size={iconSizes[size] || iconSizes.md}
                    className="text-white/70"
                />
            )}
        </div>
    );

    const Component = isInteractive ? 'button' : 'div';

    return (
        <Component
            className={cn(
                'relative inline-flex items-center justify-center rounded-full flex-shrink-0',
                'ring-white dark:ring-neutral-800',
                ringSizes[size] || ringSizes.md,
                isInteractive &&
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 cursor-pointer',
                sizeClasses[size] || sizeClasses.md,
                className
            )}
            {...(isInteractive ? { type: 'button' } : {})}
            {...props}
        >
            {avatarContent}

            {showStatus && status && (
                <span
                    className={cn(
                        'absolute rounded-full ring-2 ring-white dark:ring-neutral-800',
                        statusColors[status] || statusColors.offline,
                        statusDotSizes[size] || statusDotSizes.md
                    )}
                    title={status.charAt(0).toUpperCase() + status.slice(1)}
                />
            )}
        </Component>
    );
};

export default memo(UserAvatar);