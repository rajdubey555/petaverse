import { memo, useState, useCallback } from 'react';
import { FiFlag } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { REPORT_REASONS } from '../../config/constants';

const ReportButton = ({
    petId,
    petName,
    onReport,
    size = 'sm',
    variant = 'ghost',
    disabled = false,
    className,
    ...props
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleOpen = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowForm(true);
        setSelectedReason('');
        setDescription('');
        setError('');
        setSuccess(false);
    }, []);

    const handleClose = useCallback(() => {
        setShowForm(false);
        setSelectedReason('');
        setDescription('');
        setError('');
        setSuccess(false);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!selectedReason) {
                setError('Please select a reason for reporting.');
                return;
            }

            if (description.length < 10) {
                setError('Please provide a description (at least 10 characters).');
                return;
            }

            setIsSubmitting(true);
            setError('');

            try {
                if (onReport) {
                    await onReport({
                        petId,
                        reason: selectedReason,
                        description,
                    });
                }
                setSuccess(true);
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } catch (err) {
                setError(err?.message || 'Failed to submit report. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [selectedReason, description, onReport, petId, handleClose]
    );

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-sm px-4 py-2',
    };

    const variantClasses = {
        ghost: 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
        outline: 'border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400',
        subtle: 'text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400',
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    sizeClasses[size] || sizeClasses.sm,
                    variantClasses[variant] || variantClasses.ghost,
                    className
                )}
                aria-label={`Report ${petName || 'pet'}`}
                title="Report this listing"
                {...props}
            >
                <FiFlag size={size === 'lg' ? 16 : 14} />
                <span>Report</span>
            </button>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                    Report Submitted
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                    Thank you for helping keep our community safe.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                                        <FiFlag className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                            Report Listing
                                        </h3>
                                        {petName && (
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                &ldquo;{petName}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Reason for reporting
                                    </label>
                                    <div className="space-y-1.5">
                                        {REPORT_REASONS.map((reason) => (
                                            <label
                                                key={reason.value}
                                                className={cn(
                                                    'flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors',
                                                    'hover:border-primary-300 dark:hover:border-primary-600',
                                                    selectedReason === reason.value
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 dark:border-primary-400'
                                                        : 'border-neutral-200 dark:border-neutral-700'
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="reportReason"
                                                    value={reason.value}
                                                    checked={selectedReason === reason.value}
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={cn(
                                                        'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                                                        selectedReason === reason.value
                                                            ? 'border-primary-500'
                                                            : 'border-neutral-300 dark:border-neutral-600'
                                                    )}
                                                >
                                                    {selectedReason === reason.value && (
                                                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                                                    )}
                                                </div>
                                                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                                    {reason.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label
                                        htmlFor="reportDescription"
                                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="reportDescription"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Please describe the issue in detail..."
                                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors"
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                        {description.length}/500 characters
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Report'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(ReportButton);