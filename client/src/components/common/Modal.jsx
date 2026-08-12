import { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import cn from '../../utils/cn';
import useMediaQuery from '../../hooks/useMediaQuery';

/**
 * Modal — Reusable modal/dialog component following the PetVerse Design System §14.
 *
 * On mobile (< 640px), transforms into a bottom sheet.
 *
 * Props:
 * - isOpen: Controls visibility
 * - onClose: Close handler
 * - title: Modal heading
 * - subtitle: Optional subheading below title
 * - children: Modal body content
 * - footer: Optional footer content (or use footer buttons)
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')
 * - persistent: Prevent closing on backdrop click and Escape key
 * - showCloseButton: Show the X close button (default: true)
 * - className: Additional classes for the modal container
 * - overlayClassName: Additional classes for the overlay
 * - initialFocus: Ref to element to focus on mount
 */

const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full h-full',
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: '0%' },
    exit: { y: '100%' },
};

const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = 'lg',
    persistent = false,
    showCloseButton = true,
    className,
    overlayClassName,
    initialFocus,
}) => {
    const isMobile = useMediaQuery('(max-width: 639px)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Store previously focused element
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
        }
    }, [isOpen]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    // Focus trap and initial focus
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        if (initialFocus?.current) {
            initialFocus.current.focus();
        } else {
            const firstFocusable = modalRef.current.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                modalRef.current.focus();
            }
        }
    }, [isOpen, initialFocus]);

    // Return focus on close
    useEffect(() => {
        if (!isOpen && previousActiveElement.current) {
            const el = previousActiveElement.current;
            if (el && typeof el.focus === 'function') {
                setTimeout(() => el.focus(), 0);
            }
        }
    }, [isOpen]);

    // Handle Escape key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape' && !persistent) {
                onClose();
                return;
            }

            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;

                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        },
        [onClose, persistent]
    );

    const handleBackdropClick = useCallback(
        (e) => {
            if (!persistent && e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose, persistent]
    );

    const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={cn(
                        'fixed inset-0 z-50 flex items-end sm:items-center justify-center',
                        overlayClassName
                    )}
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={transition}
                    onClick={handleBackdropClick}
                    onKeyDown={handleKeyDown}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby={title ? 'modal-title' : undefined}
                    aria-describedby={subtitle ? 'modal-subtitle' : undefined}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal Container */}
                    {isMobile ? (
                        <motion.div
                            ref={modalRef}
                            className={cn(
                                'relative w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-neutral-900 shadow-soft-lg',
                                sizeMap[size],
                                className
                            )}
                            variants={sheetVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 35,
                            }}
                            tabIndex={-1}
                        >
                            {/* Drag Handle (mobile) */}
                            <div className="flex justify-center pt-3 pb-1 sm:hidden">
                                <div className="w-8 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                            </div>
                            <ModalContent
                                title={title}
                                subtitle={subtitle}
                                showCloseButton={showCloseButton}
                                onClose={onClose}
                                footer={footer}
                            >
                                {children}
                            </ModalContent>
                        </motion.div>
                    ) : (
                        <motion.div
                            ref={modalRef}
                            className={cn(
                                'relative w-full max-h-[calc(100vh-64px)] overflow-y-auto rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 shadow-soft-lg',
                                sizeMap[size],
                                className
                            )}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={transition}
                            tabIndex={-1}
                        >
                            <ModalContent
                                title={title}
                                subtitle={subtitle}
                                showCloseButton={showCloseButton}
                                onClose={onClose}
                                footer={footer}
                            >
                                {children}
                            </ModalContent>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

const ModalContent = ({ title, subtitle, showCloseButton, onClose, footer, children }) => (
    <>
        {/* Header */}
        {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 pb-4">
                <div className="min-w-0 flex-1 mr-4">
                    {title && (
                        <h2 id="modal-title" className="text-xl font-display font-semibold text-neutral-900 dark:text-white truncate">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p id="modal-subtitle" className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="btn-icon btn-ghost rounded-full flex-shrink-0 -mr-1 -mt-1"
                        aria-label="Close modal"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        )}

        {/* Body */}
        <div className="px-6 py-2">{children}</div>

        {/* Footer */}
        {footer && (
            <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                {footer}
            </div>
        )}
    </>
);

export default Modal;