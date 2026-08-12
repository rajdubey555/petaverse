import { motion } from 'framer-motion';
import cn from '../../utils/cn';

/**
 * Spinner — Reusable loading spinner component.
 *
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: 'primary' | 'white' | 'gray' (default: 'primary')
 * - className: Additional classes
 * - label: Accessible label for screen readers
 */

const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
};

const variantMap = {
    primary: 'border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-500 dark:border-gray-700 dark:border-t-gray-400',
};

const Spinner = ({ size = 'md', variant = 'primary', className, label = 'Loading...' }) => {
    return (
        <div
            role="status"
            aria-label={label}
            className={cn('inline-flex items-center justify-center', className)}
        >
            <motion.div
                className={cn(
                    'rounded-full',
                    sizeMap[size],
                    variantMap[variant]
                )}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span className="sr-only">{label}</span>
        </div>
    );
};

export default Spinner;