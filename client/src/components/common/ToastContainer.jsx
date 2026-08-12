import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { removeToast } from '../../store/slices/toastSlice';
import Toast from './Toast';
import cn from '../../utils/cn';

/**
 * ToastContainer — Renders all active toast notifications.
 *
 * Positioned fixed top-right. Listens to the Redux toast slice.
 * Handles dismissal animations via AnimatePresence.
 */

const ToastContainer = () => {
    const dispatch = useDispatch();
    const toasts = useSelector((state) => state.toast.toasts);

    const handleDismiss = useCallback(
        (id) => {
            dispatch(removeToast(id));
        },
        [dispatch]
    );

    if (toasts.length === 0) return null;

    return (
        <div
            className={cn(
                'fixed top-4 right-4 z-[9999] flex flex-col-reverse gap-3 pointer-events-none',
                'max-h-[calc(100vh-2rem)] overflow-y-auto'
            )}
            aria-live="polite"
            aria-label="Notifications"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        className="pointer-events-auto"
                    >
                        <Toast toast={toast} onDismiss={handleDismiss} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;