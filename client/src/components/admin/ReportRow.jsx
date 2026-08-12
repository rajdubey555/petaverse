import { memo } from 'react';
import { FiEye, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import Button from '../common/Button';

const reasonLabels = {
    inappropriate_content: 'Inappropriate Content',
    spam: 'Spam',
    misleading_information: 'Misleading Info',
    duplicate_listing: 'Duplicate Listing',
    sold_or_adopted: 'Sold / Adopted',
    harmful_or_dangerous: 'Harmful / Dangerous',
    other: 'Other',
};

const reasonIcons = {
    inappropriate_content: FiAlertTriangle,
    spam: FiAlertTriangle,
    misleading_information: FiAlertTriangle,
    duplicate_listing: FiAlertTriangle,
    sold_or_adopted: FiAlertTriangle,
    harmful_or_dangerous: FiAlertTriangle,
    other: FiAlertTriangle,
};

const statusBadgeVariant = {
    pending: 'warning',
    reviewed: 'info',
    resolved: 'success',
    dismissed: 'neutral',
};

const ReportRow = ({
    report,
    index,
    onView,
    isUpdating = false,
}) => {
    const reason = report.reason || 'other';
    const status = report.status || 'pending';
    const ReasonIcon = reasonIcons[reason] || FiAlertTriangle;

    return (
        <tr
            className={cn(
                'transition-colors',
                'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                status === 'dismissed' && 'opacity-60'
            )}
        >
            {/* Reason */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                        status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/15' : 'bg-neutral-100 dark:bg-neutral-700'
                    )}>
                        <ReasonIcon className={cn(
                            'w-4 h-4',
                            status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500'
                        )} />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {reasonLabels[reason] || reason}
                    </span>
                </div>
            </td>

            {/* Reporter */}
            <td className="px-4 py-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[140px] block">
                    {report.reporter?.name || 'Unknown'}
                </span>
            </td>

            {/* Pet */}
            <td className="px-4 py-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[140px] block">
                    {report.pet?.name || 'Unknown'}
                </span>
            </td>

            {/* Description */}
            <td className="px-4 py-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] block">
                    {report.description || '—'}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <Badge
                    variant={statusBadgeVariant[status] || 'neutral'}
                    size="sm"
                    dot
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            </td>

            {/* Date */}
            <td className="px-4 py-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400" title={formatDate(report.createdAt)}>
                    {formatRelativeTime(report.createdAt)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(report._id)}
                        leftIcon={FiEye}
                    >
                        View
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default memo(ReportRow);