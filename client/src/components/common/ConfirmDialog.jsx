import { FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import cn from '../../utils/cn';
import Button from './Button';
import Modal from './Modal';

/**
 * ConfirmDialog — Confirmation dialog built on top of Modal.
 * Follows the PetVerse Design System §14 (Modal System).
 *
 * Variants map to semantic intentions:
 * - danger: Destructive actions (delete, remove, block)
 * - warning: Cautionary actions (archive, deactivate, skip)
 * - info: Neutral confirmations (save changes, proceed)
 *
 * Props:
 * - isOpen: Controls visibility
 * - onClose: Close handler
 * - onConfirm: Confirm action handler
 * - onCancel: Cancel handler (falls back to onClose)
 * - title: Dialog heading (default: "Are you sure?")
 * - message: Dialog body message
 * - variant: 'danger' | 'warning' | 'info' (default: 'info')
 * - confirmText: Confirm button label (default: "Confirm")
 * - cancelText: Cancel button label (default: "Cancel")
 * - isLoading: Loading state for confirm button
 * - children: Optional custom body content (replaces message)
 */

const variantConfig = {
    danger: {
        icon: FiAlertCircle,
        iconBg: 'bg-red-100 dark:bg-red-500/15',
        iconColor: 'text-red-600 dark:text-red-400',
        confirmVariant: 'danger',
        ringColor: 'ring-red-500/20',
    },
    warning: {
        icon: FiAlertTriangle,
        iconBg: 'bg-amber-100 dark:bg-amber-500/15',
        iconColor: 'text-amber-600 dark:text-amber-400',
        confirmVariant: 'primary',
        ringColor: 'ring-amber-500/20',
    },
    info: {
        icon: FiInfo,
        iconBg: 'bg-primary-100 dark:bg-primary-500/15',
        iconColor: 'text-primary-600 dark:text-primary-400',
        confirmVariant: 'primary',
        ringColor: 'ring-primary-500/20',
    },
};

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    message,
    variant = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    children,
}) => {
    const config = variantConfig[variant] || variantConfig.info;
    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm?.();
        onClose();
    };

    const handleCancel = () => {
        onCancel ? onCancel() : onClose();
    };

    const footer = (
        <>
            <Button
                variant="outline"
                size="md"
                onClick={handleCancel}
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            <Button
                variant={config.confirmVariant}
                size="md"
                onClick={handleConfirm}
                isLoading={isLoading}
            >
                {confirmText}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            size="sm"
            persistent={isLoading}
            showCloseButton={!isLoading}
            className="!p-0"
        >
            <div className="p-6 text-center sm:text-left">
                {/* Icon */}
                <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-full mb-4">
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full',
                            config.iconBg
                        )}
                    >
                        <Icon className={cn('w-6 h-6', config.iconColor)} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-semibold text-neutral-900 dark:text-white mb-2">
                    {title}
                </h3>

                {/* Message or Children */}
                {message && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {message}
                    </p>
                )}
                {children && <div className="mt-2">{children}</div>}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-2xl">
                <Button
                    variant="outline"
                    size="md"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                    {cancelText}
                </Button>
                <Button
                    variant={config.confirmVariant}
                    size="md"
                    onClick={handleConfirm}
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;