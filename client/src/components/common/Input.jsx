import { forwardRef } from 'react';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * Input — Reusable form input component following the PetVerse Design System §9.
 *
 * Supports: text, email, password, number, tel, url, textarea
 * Features: label, error, success, helper text, left/right icons, character count
 *
 * Props:
 * - label: Label text
 * - error: Error message string
 * - success: Success message string
 * - helperText: Helper/description text
 * - leftIcon / rightIcon: React icon components
 * - multiline: Renders as textarea
 * - rows: Number of rows for textarea (default: 4)
 * - maxLength: Max character count, shows counter
 * - hideLabel: Visually hide the label (for accessibility)
 * - containerClassName: Classes for outermost wrapper
 * - All standard input/textarea HTML attributes
 */

const Input = forwardRef(
    (
        {
            label,
            error,
            success,
            helperText,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            multiline = false,
            rows = 4,
            maxLength,
            hideLabel = false,
            className,
            containerClassName,
            id,
            disabled,
            readOnly,
            value,
            name,
            ...props
        },
        ref
    ) => {
        const inputId =
            id || (name ? `input-${name}` : `input-${Math.random().toString(36).slice(2, 9)}`);
        const hasError = Boolean(error);
        const hasSuccess = Boolean(success) && !hasError;
        const charCount = typeof value === 'string' ? value.length : 0;
        const isOverLimit = maxLength ? charCount > maxLength : false;

        const inputClasses = cn(
            'input',
            hasError && 'input-error',
            hasSuccess && '!border-accent-500 focus:!ring-accent-500/20',
            LeftIcon && 'pl-11',
            (RightIcon || hasError || hasSuccess) && 'pr-11',
            disabled && 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800',
            readOnly && 'bg-neutral-50 dark:bg-neutral-800/50 cursor-default',
            multiline && 'resize-y min-h-[96px] py-3 leading-relaxed',
            className
        );

        const statusIcon = hasError ? (
            <FiAlertCircle className="w-[18px] h-[18px] text-red-500" />
        ) : hasSuccess ? (
            <FiCheck className="w-[18px] h-[18px] text-accent-500" />
        ) : null;

        const Tag = multiline ? 'textarea' : 'input';

        return (
            <div className={cn('flex flex-col gap-1.5', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            'label',
                            hideLabel && 'sr-only',
                            disabled && 'text-neutral-400 dark:text-neutral-600'
                        )}
                    >
                        {label}
                        {props.required && (
                            <span className="text-red-500 ml-0.5" aria-hidden="true">
                                *
                            </span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {LeftIcon && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                            <LeftIcon className="w-[18px] h-[18px]" />
                        </span>
                    )}

                    <Tag
                        ref={ref}
                        id={inputId}
                        name={name}
                        disabled={disabled}
                        readOnly={readOnly}
                        value={value}
                        rows={multiline ? rows : undefined}
                        className={inputClasses}
                        aria-invalid={hasError ? 'true' : undefined}
                        aria-describedby={
                            [
                                hasError && `${inputId}-error`,
                                hasSuccess && `${inputId}-success`,
                                helperText && `${inputId}-helper`,
                            ]
                                .filter(Boolean)
                                .join(' ') || undefined
                        }
                        {...props}
                    />

                    {(RightIcon || statusIcon) && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {statusIcon || (
                                <RightIcon className="w-[18px] h-[18px] text-neutral-400" />
                            )}
                        </span>
                    )}
                </div>

                {hasError && (
                    <p id={`${inputId}-error`} className="error-text animate-slide-up" role="alert">
                        {error}
                    </p>
                )}

                {hasSuccess && (
                    <p id={`${inputId}-success`} className="text-xs text-accent-600 mt-1">
                        {success}
                    </p>
                )}

                {helperText && !hasError && (
                    <p id={`${inputId}-helper`} className="text-xs text-neutral-500 mt-1">
                        {helperText}
                    </p>
                )}

                {maxLength && (
                    <div className="flex justify-end mt-0.5">
                        <span
                            className={cn(
                                'text-xs',
                                isOverLimit ? 'text-red-500 font-medium' : 'text-neutral-400'
                            )}
                        >
                            {charCount}/{maxLength}
                        </span>
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;