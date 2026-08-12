import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * ErrorFallback — Rendered when an error boundary catches an error.
 *
 * Props:
 * - error: The Error object
 * - resetErrorBoundary: Callback to retry / reset the error state
 * - message: Optional custom message override
 */

const ErrorFallback = ({ error, resetErrorBoundary, message }) => {
    const displayMessage =
        message || error?.message || 'Something went wrong loading this section.';

    return (
        <div
            role="alert"
            className={cn(
                'flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl',
                'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
            )}
        >
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                Oops! Something went wrong
            </h3>

            <p className="text-sm text-red-600 dark:text-red-400 max-w-md mb-6">
                {displayMessage}
            </p>

            {resetErrorBoundary && (
                <button
                    onClick={resetErrorBoundary}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    <FiRefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorFallback;