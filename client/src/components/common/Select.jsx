import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronDown, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * Select — Reusable select/dropdown component following the PetVerse Design System §9.3.
 *
 * Composes the `.input` base CSS class with `appearance-none`.
 * Supports native `<select>` behavior plus an optional searchable listbox variant.
 *
 * Props:
 * - label: Label text
 * - error: Error message string
 * - success: Success message string
 * - helperText: Helper/description text
 * - options: Array of { value, label } or array of strings
 * - placeholder: Placeholder text (first disabled option)
 * - searchable: Enable search/filter within dropdown (default: false)
 * - hideLabel: Visually hide the label (sr-only)
 * - containerClassName: Classes for outermost wrapper
 * - All standard select HTML attributes
 */

const Select = forwardRef(
    (
        {
            label,
            error,
            success,
            helperText,
            options = [],
            placeholder = 'Select an option',
            searchable = false,
            hideLabel = false,
            className,
            containerClassName,
            id,
            disabled,
            name,
            value,
            onChange,
            ...props
        },
        ref
    ) => {
        const selectId =
            id || (name ? `select-${name}` : `select-${Math.random().toString(36).slice(2, 9)}`);
        const hasError = Boolean(error);
        const hasSuccess = Boolean(success) && !hasError;

        const selectClasses = cn(
            'input appearance-none cursor-pointer',
            hasError && 'input-error',
            hasSuccess && '!border-accent-500 focus:!ring-accent-500/20',
            disabled && 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800',
            className
        );

        const normalizedOptions = options.map((opt) =>
            typeof opt === 'string' ? { value: opt, label: opt } : opt
        );

        return (
            <div className={cn('flex flex-col gap-1.5', containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
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
                    <select
                        ref={ref}
                        id={selectId}
                        name={name}
                        disabled={disabled}
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (onChange) {
                                // Support both onChange(val) and onChange(e)
                                try {
                                    onChange(val, e);
                                } catch (err) {
                                    onChange(e);
                                }
                            }
                        }}
                        className={selectClasses}
                        aria-invalid={hasError ? 'true' : undefined}
                        aria-describedby={[
                            hasError && `${selectId}-error`,
                            hasSuccess && `${selectId}-success`,
                            helperText && `${selectId}-helper`,
                        ]
                            .filter(Boolean)
                            .join(' ') || undefined}
                        {...props}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {normalizedOptions.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.disabled}
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Chevron Down Icon */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        {hasError ? (
                            <FiAlertCircle className="w-[18px] h-[18px] text-red-500" />
                        ) : hasSuccess ? (
                            <FiCheck className="w-[18px] h-[18px] text-accent-500" />
                        ) : (
                            <FiChevronDown className="w-[18px] h-[18px] transition-transform duration-200" />
                        )}
                    </span>
                </div>

                {hasError && (
                    <p id={`${selectId}-error`} className="error-text animate-slide-up" role="alert">
                        {error}
                    </p>
                )}

                {hasSuccess && (
                    <p id={`${selectId}-success`} className="text-xs text-accent-600 mt-1">
                        {success}
                    </p>
                )}

                {helperText && !hasError && (
                    <p id={`${selectId}-helper`} className="text-xs text-neutral-500 mt-1">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

/**
 * SearchableSelect — A custom listbox-style dropdown with built-in search/filter.
 * Renders a button trigger + absolutely-positioned dropdown with search input.
 */
const SearchableSelect = ({
    label,
    error,
    success,
    helperText,
    options = [],
    value,
    onChange,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    hideLabel = false,
    disabled = false,
    className,
    containerClassName,
    id,
    name,
    ...props
}) => {
    const selectId =
        id || (name ? `searchable-select-${name}` : `searchable-select-${Math.random().toString(36).slice(2, 9)}`);
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;

    const normalizedOptions = options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    const filteredOptions = searchTerm
        ? normalizedOptions.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : normalizedOptions;

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Reset active index when filtered options change
    useEffect(() => {
        setActiveIndex(-1);
    }, [searchTerm]);

    // Scroll active option into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeEl = listRef.current.children[activeIndex];
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex]);

    const handleSelect = useCallback(
        (opt) => {
            if (opt.disabled) return;
            onChange?.({ target: { value: opt.value, name } });
            setIsOpen(false);
            setSearchTerm('');
        },
        [onChange, name]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (!isOpen) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsOpen(true);
                }
                return;
            }

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setSearchTerm('');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredOptions.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                        handleSelect(filteredOptions[activeIndex]);
                    }
                    break;
                case 'Tab':
                    setIsOpen(false);
                    setSearchTerm('');
                    break;
                default:
                    break;
            }
        },
        [isOpen, activeIndex, filteredOptions, handleSelect]
    );

    return (
        <div className={cn('flex flex-col gap-1.5', containerClassName)}>
            {label && (
                <label
                    id={`${selectId}-label`}
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

            <div ref={containerRef} className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    id={selectId}
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'input flex items-center justify-between text-left appearance-none cursor-pointer',
                        hasError && 'input-error',
                        hasSuccess && '!border-accent-500 focus:!ring-accent-500/20',
                        !selectedOption && 'text-neutral-400',
                        disabled && 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800',
                        className
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-labelledby={label ? `${selectId}-label` : undefined}
                    aria-invalid={hasError ? 'true' : undefined}
                    aria-describedby={[
                        hasError && `${selectId}-error`,
                        hasSuccess && `${selectId}-success`,
                        helperText && `${selectId}-helper`,
                    ]
                        .filter(Boolean)
                        .join(' ') || undefined}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className="flex items-center ml-2 flex-shrink-0">
                        {selectedOption && !disabled && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange?.({ target: { value: '', name } });
                                }}
                                className="p-0.5 mr-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                aria-label="Clear selection"
                            >
                                <FiX className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                        )}
                        <FiChevronDown
                            className={cn(
                                'w-[18px] h-[18px] text-neutral-400 transition-transform duration-200',
                                isOpen && 'rotate-180'
                            )}
                        />
                    </span>
                </button>

                {/* Dropdown Listbox */}
                {isOpen && (
                    <div
                        className="absolute z-50 mt-1 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-soft-lg overflow-hidden"
                        role="listbox"
                        aria-labelledby={label ? `${selectId}-label` : undefined}
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={searchPlaceholder}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <ul ref={listRef} className="max-h-60 overflow-y-auto py-1" role="none">
                            {filteredOptions.length === 0 ? (
                                <li className="px-4 py-3 text-sm text-neutral-500 text-center">
                                    No options found
                                </li>
                            ) : (
                                filteredOptions.map((opt, index) => (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={opt.value === value}
                                        aria-disabled={opt.disabled}
                                        onClick={() => handleSelect(opt)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={cn(
                                            'px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100',
                                            'text-neutral-700 dark:text-neutral-300',
                                            opt.disabled && 'opacity-40 cursor-not-allowed',
                                            opt.value === value &&
                                            'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 font-medium',
                                            activeIndex === index &&
                                            opt.value !== value &&
                                            'bg-neutral-100 dark:bg-neutral-800',
                                            !opt.disabled && 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        )}
                                    >
                                        {opt.label}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {hasError && (
                <p id={`${selectId}-error`} className="error-text animate-slide-up" role="alert">
                    {error}
                </p>
            )}

            {hasSuccess && (
                <p id={`${selectId}-success`} className="text-xs text-accent-600 mt-1">
                    {success}
                </p>
            )}

            {helperText && !hasError && (
                <p id={`${selectId}-helper`} className="text-xs text-neutral-500 mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
};

SearchableSelect.displayName = 'SearchableSelect';

export { SearchableSelect };
export default Select;