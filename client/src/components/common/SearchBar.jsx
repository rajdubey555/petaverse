import { useState, useCallback, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import cn from '../../utils/cn';
import useDebounce from '../../hooks/useDebounce';

/**
 * SearchBar — Reusable search input with debounced callback.
 * Composes the Input component pattern with search-specific behavior.
 *
 * Features:
 * - Debounced search callback (default: 300ms)
 * - Clear button (X) when search has value
 * - Search icon (magnifying glass)
 * - Loading spinner during active debounce
 * - Keyboard shortcut: Escape to clear
 * - Optional instant search on Enter key
 * - Auto-focus support
 * - Accessible: role="searchbox", aria-label
 *
 * Props:
 * - value: Controlled search value
 * - onChange: Called on every keystroke (for controlled input)
 * - onSearch: Debounced callback with search term
 * - placeholder: Placeholder text (default: "Search...")
 * - debounceMs: Debounce delay in ms (default: 300)
 * - instantSearch: Trigger onSearch on Enter press immediately
 * - autoFocus: Auto-focus the input on mount
 * - variant: 'default' | 'pill' | 'minimal' (default: 'default')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - className / containerClassName: Additional classes
 * - disabled: Disable the search
 */

const SearchBar = ({
    value = '',
    onChange,
    onSearch,
    placeholder = 'Search...',
    debounceMs = 300,
    instantSearch = false,
    autoFocus = false,
    variant = 'default',
    size = 'md',
    className,
    containerClassName,
    disabled = false,
}) => {
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(value);
    const [isTyping, setIsTyping] = useState(false);

    const debouncedValue = useDebounce(localValue, debounceMs);

    // Sync external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Fire debounced search
    useEffect(() => {
        if (debouncedValue !== value) {
            onSearch?.(debouncedValue);
            setIsTyping(false);
        }
        // We intentionally only react to debouncedValue changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    // Auto-focus
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = useCallback(
        (e) => {
            const newValue = e.target.value;
            setLocalValue(newValue);
            setIsTyping(true);
            onChange?.(newValue);
        },
        [onChange]
    );

    const handleClear = useCallback(() => {
        setLocalValue('');
        setIsTyping(false);
        onChange?.('');
        onSearch?.('');
        inputRef.current?.focus();
    }, [onChange, onSearch]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') {
                handleClear();
            }
            if (e.key === 'Enter' && instantSearch) {
                onSearch?.(localValue);
                setIsTyping(false);
            }
        },
        [handleClear, instantSearch, localValue, onSearch]
    );

    const variantStyles = {
        default: 'rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900',
        pill: 'rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900',
        minimal: 'rounded-xl bg-neutral-100 dark:bg-neutral-800 border-transparent focus-within:border-primary-300 dark:focus-within:border-primary-600',
    };

    const sizeStyles = {
        sm: 'h-9 text-sm',
        md: 'h-11 text-sm',
        lg: 'h-12 text-base',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-[18px] h-[18px]',
        lg: 'w-5 h-5',
    };

    const hasValue = localValue.length > 0;

    return (
        <div className={cn('relative', containerClassName)}>
            {/* Search Icon */}
            <span
                className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
                    isTyping ? 'text-primary-500' : 'text-neutral-400'
                )}
            >
                <FiSearch className={iconSizes[size] || iconSizes.md} />
            </span>

            <input
                ref={inputRef}
                type="search"
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                role="searchbox"
                aria-label={placeholder}
                className={cn(
                    'w-full pl-11 pr-10 rounded-xl transition-all duration-200',
                    '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
                    'text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-500',
                    variantStyles[variant] || variantStyles.default,
                    sizeStyles[size] || sizeStyles.md,
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            />

            {/* Clear / Actions */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {hasValue && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Clear search"
                    >
                        <FiX className={cn(iconSizes[size] || iconSizes.md, 'text-neutral-400')} />
                    </button>
                )}

                {/* Loading indicator during active debounce */}
                {isTyping && hasValue && (
                    <span className="flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-primary-400 animate-pulse" />
                    </span>
                )}
            </span>
        </div>
    );
};

export default SearchBar;