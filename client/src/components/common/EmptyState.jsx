import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import cn from '../../utils/cn';

/**
 * EmptyState — Reusable empty state component for lists, searches, and pages.
 *
 * Props:
 * - icon: React icon component to display (default: none — uses illustration-style emoji)
 * - title: Main heading text
 * - description: Supporting text
 * - actionLabel: Optional CTA button label
 * - actionTo: React Router link for the CTA button
 * - actionOnClick: Optional onClick handler (alternative to actionTo)
 * - className: Additional container classes
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 */

const EmptyState = ({
    icon: Icon,
    title = 'Nothing here yet',
    description = '',
    actionLabel,
    actionTo,
    actionOnClick,
    className,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'py-8 px-4',
        md: 'py-16 px-6',
        lg: 'py-24 px-8',
    };

    const iconSizes = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    };

    return (
        <motion.div
            className={cn(
                'flex flex-col items-center justify-center text-center rounded-2xl',
                sizeClasses[size],
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {Icon && (
                <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Icon className={cn(iconSizes[size], 'text-gray-400 dark:text-gray-500')} />
                </div>
            )}

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    {description}
                </p>
            )}

            {actionLabel && actionTo && (
                <Link
                    to={actionTo}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    {actionLabel}
                </Link>
            )}

            {actionLabel && actionOnClick && !actionTo && (
                <button
                    onClick={actionOnClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default EmptyState;