import cn from '../../utils/cn';

/**
 * Badge — Reusable badge/pill component following the PetVerse Design System §11.
 *
 * Variants: primary | success | warning | danger | neutral
 *           Also supports species colors: orange, violet, cyan, blue, pink, yellow, emerald
 *           And listing type colors: adoption, rehoming, lost, found
 * Sizes:    sm | md | lg
 *
 * Props:
 * - variant: Badge color variant (default: 'neutral')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - leftIcon / rightIcon: React icon components
 * - dot: Show a colored dot indicator
 * - pulse: Animate with pulse (for "urgent" badges)
 * - className: Additional classes
 */

const variantMap = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',

    // Species colors (§2.9)
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',

    // Listing type colors (§2.8)
    adoption: 'bg-accent-500 text-white',
    rehoming: 'bg-amber-500 text-white',
    lost: 'bg-red-500 text-white',
    found: 'bg-violet-500 text-white',

    // Special badges (§11.4)
    featured:
        'bg-gradient-to-r from-primary-500 to-secondary-500 text-white',
    'new': 'bg-accent-500 text-white',
    urgent: 'bg-red-500 text-white',
    verified: 'badge-primary',
    'top-adopter': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
};

const sizeClasses = {
    sm: 'px-2 py-0 text-2xs gap-0.5',
    md: 'px-2.5 py-0.5 text-xs gap-1',
    lg: 'px-3 py-1 text-sm gap-1.5',
};

const dotColors = {
    primary: 'bg-primary-500',
    success: 'bg-accent-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    neutral: 'bg-neutral-400',
    orange: 'bg-orange-500',
    violet: 'bg-violet-500',
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
    emerald: 'bg-emerald-500',
    adoption: 'bg-white',
    rehoming: 'bg-white',
    lost: 'bg-white',
    found: 'bg-white',
    featured: 'bg-white',
    'new': 'bg-white',
    urgent: 'bg-white',
    verified: 'bg-primary-500',
    'top-adopter': 'bg-amber-500',
};

const Badge = ({
    children,
    variant = 'neutral',
    size = 'md',
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    dot = false,
    pulse = false,
    className,
}) => {
    return (
        <span
            className={cn(
                'badge inline-flex items-center',
                variantMap[variant] || variantMap.neutral,
                sizeClasses[size] || sizeClasses.md,
                pulse && 'animate-pulse-soft',
                className
            )}
        >
            {dot && (
                <span
                    className={cn(
                        'inline-block rounded-full flex-shrink-0',
                        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
                        dotColors[variant] || dotColors.neutral
                    )}
                    aria-hidden="true"
                />
            )}

            {LeftIcon && <LeftIcon className={cn(size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3')} />}
            {children}
            {RightIcon && <RightIcon className={cn(size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3')} />}
        </span>
    );
};

export default Badge;