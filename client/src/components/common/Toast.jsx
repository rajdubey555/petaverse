import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import {
    FiCheckCircle,
    FiAlertCircle,
    FiAlertTriangle,
    FiInfo,
    FiX,
} from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * Toast — Individual toast notification item.
 *
 * Props:
 * - toast: { id, type, message, duration }
 * - onDismiss: Callback to dismiss this toast
 */

const iconMap = {
    success: { icon: FiCheckCircle, ring: 'ring-green-400/20', bg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-500' },
    error: { icon: FiAlertCircle, ring: 'ring-red-400/20', bg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500' },
    warning: { icon: FiAlertTriangle, ring: 'ring-yellow-400/20', bg: 'bg-yellow-50 dark:bg-yellow-900/20', iconColor: 'text-yellow-500' },
    info: { icon: FiInfo, ring: 'ring-blue-400/20', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
};

const Toast = ({ toast, onDismiss }) => {
    const { type = 'info', message, id } = toast;
    const config = iconMap[type] || iconMap.info;
    const Icon = config.icon;

    useEffect(() => {
        if (toast.duration === 0) return; // Don't auto-dismiss sticky toasts
        const timer = setTimeout(() => {
            onDismiss(id);
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [id, toast.duration, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
                'flex items-start gap-3 p-4 rounded-xl shadow-lg ring-1 backdrop-blur-sm min-w-[320px] max-w-[420px]',
                config.ring,
                config.bg,
                'bg-white dark:bg-gray-800'
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />

            <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed break-words">
                {message}
            </p>

            <button
                onClick={() => onDismiss(id)}
                className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Dismiss notification"
            >
                <FiX className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;