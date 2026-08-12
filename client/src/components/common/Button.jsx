import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * Button — Reusable button component following the PetVerse Design System §8.
 *
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes:    xs | sm | md | lg | xl
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - isLoading: Show spinner, disable interaction
 * - leftIcon / rightIcon: React icon components
 * - fullWidth: w-full
 * - as: 'button' | 'a' | typeof Link (render as link)
 * - href: Required when as='a'
 * - to: Required when as={Link}
 * - All standard button HTML attributes
 */

const variantClasses = {
    primary:
        'btn-primary shadow-sm hover:shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] active:shadow-sm',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm active:bg-green-800',
};

const sizeClasses = {
    xs: 'btn-sm px-2 py-1 text-2xs gap-1 rounded-lg',
    sm: 'btn-sm gap-1',
    md: 'gap-2',
    lg: 'btn-lg gap-2',
    xl: 'btn-lg px-9 py-4 text-lg gap-2.5 rounded-2xl',
};

const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-[18px] h-[18px]',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
};

const Button = forwardRef(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            fullWidth = false,
            disabled = false,
            className,
            as: Component = 'button',
            type = 'button',
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        const base = cn(
            variantClasses[variant] || variantClasses.primary,
            sizeClasses[size] || sizeClasses.md,
            fullWidth && 'w-full',
            'relative',
            className
        );

        const iconClass = iconSizes[size] || iconSizes.md;

        if (Component === 'button') {
            return (
                <motion.button
                    ref={ref}
                    type={type}
                    disabled={isDisabled}
                    className={base}
                    whileTap={isDisabled ? undefined : { scale: 0.98 }}
                    whileHover={isDisabled ? undefined : { scale: 1.01 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    {...props}
                >
                    {isLoading && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                className="inline-flex"
                            >
                                <FiLoader className={iconClass} />
                            </motion.span>
                        </span>
                    )}

                    <span
                        className={cn(
                            'inline-flex items-center',
                            isLoading && 'invisible'
                        )}
                    >
                        {LeftIcon && <LeftIcon className={iconClass} />}
                        {children}
                        {RightIcon && <RightIcon className={iconClass} />}
                    </span>
                </motion.button>
            );
        }

        return (
            <Component ref={ref} className={base} {...props}>
                {LeftIcon && <LeftIcon className={iconClass} />}
                {children}
                {RightIcon && <RightIcon className={iconClass} />}
            </Component>
        );
    }
);

Button.displayName = 'Button';

export default Button;