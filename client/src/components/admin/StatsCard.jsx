import { memo } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const iconBgMap = {
    primary: 'bg-primary-100 dark:bg-primary-500/15',
    secondary: 'bg-secondary-100 dark:bg-secondary-500/15',
    accent: 'bg-accent-100 dark:bg-accent-500/15',
    warning: 'bg-amber-100 dark:bg-amber-500/15',
    error: 'bg-red-100 dark:bg-red-500/15',
    info: 'bg-sky-100 dark:bg-sky-500/15',
};

const iconColorMap = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    accent: 'text-accent-600 dark:text-accent-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-sky-600 dark:text-sky-400',
};

const StatsCard = ({
    icon: Icon,
    label,
    value,
    trend,
    trendLabel,
    color = 'primary',
    isLoading = false,
    className,
    ...props
}) => {
    const trendPositive = trend > 0;
    const TrendIcon = trendPositive ? FiArrowUp : FiArrowDown;

    return (
        <div
            className={cn(
                'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 transition-shadow hover:shadow-soft-lg',
                className
            )}
            {...props}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {label}
                    </p>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mt-1" />
                    ) : (
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {value !== undefined && value !== null ? value.toLocaleString() : '—'}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl', iconBgMap[color] || iconBgMap.primary)}>
                        <Icon className={cn('w-5 h-5', iconColorMap[color] || iconColorMap.primary)} />
                    </div>
                )}
            </div>

            {trend !== undefined && trend !== null && !isLoading && (
                <div className="flex items-center gap-1 mt-3">
                    <span
                        className={cn(
                            'inline-flex items-center gap-0.5 text-xs font-medium',
                            trendPositive ? 'text-accent-600 dark:text-accent-400' : 'text-red-600 dark:text-red-400'
                        )}
                    >
                        <TrendIcon className="w-3 h-3" />
                        {Math.abs(trend)}%
                    </span>
                    {trendLabel && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {trendLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(StatsCard);