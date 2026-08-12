import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * PageLoader — Full-page loading spinner shown during route transitions.
 *
 * Used by React.lazy + Suspense fallback.
 *
 * Props:
 * - message: Optional loading text (default: "Loading...")
 * - fullScreen: Whether to cover the full viewport (default: true)
 * - className: Additional classes
 */

const PageLoader = ({ message = 'Loading...', fullScreen = true, className }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <motion.div
                className="relative flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
                <FiLoader className="w-12 h-12 text-primary-500" />
            </motion.div>

            <motion.p
                className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {message}
            </motion.p>
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className={cn(
                    'fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
                    className
                )}
            >
                {content}
            </div>
        );
    }

    return (
        <div className={cn('flex items-center justify-center w-full py-20', className)}>
            {content}
        </div>
    );
};

export default PageLoader;