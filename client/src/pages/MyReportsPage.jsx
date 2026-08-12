import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiAlertCircle,
    FiFlag,
    FiTrash2,
    FiEye,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiAlertTriangle,
} from 'react-icons/fi';
import { useGetMyReportsQuery, useDeleteReportMutation } from '../store/api/reportApi';
import { ROUTES } from '../config/routes';
import { PAGINATION, REPORT_REASONS } from '../config/constants';
import { formatRelativeTime, formatDate } from '../utils/formatters';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LazyImage from '../components/common/LazyImage';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } },
};

const statusConfig = {
    pending: {
        variant: 'warning',
        icon: FiClock,
        label: 'Pending Review',
    },
    reviewed: {
        variant: 'info',
        icon: FiEye,
        label: 'Under Review',
    },
    resolved: {
        variant: 'success',
        icon: FiCheckCircle,
        label: 'Resolved',
    },
    dismissed: {
        variant: 'danger',
        icon: FiXCircle,
        label: 'Dismissed',
    },
};

const reasonLabel = (reason) => {
    const found = REPORT_REASONS.find((r) => r.value === reason);
    return found ? found.label : reason;
};

const MyReportsPage = () => {
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteReportInfo, setDeleteReportInfo] = useState('');

    const { data, isLoading, isFetching, error } = useGetMyReportsQuery({
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
    });
    const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

    const reports = data?.data || [];
    const pagination = data?.pagination;

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteReport(deleteId).unwrap();
            setDeleteId(null);
            setDeleteReportInfo('');
        } catch {
            // Error handled by toast middleware
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <FiFlag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                        My Reports
                    </h1>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 ml-13">
                    Track the status of reports you've submitted
                </p>
            </motion.div>

            {/* Content */}
            {error ? (
                <EmptyState
                    icon={FiAlertCircle}
                    title="Failed to Load Reports"
                    description="Something went wrong while loading your reports."
                    action={{
                        label: 'Try Again',
                        onClick: () => window.location.reload(),
                    }}
                />
            ) : isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} padding="md" className="animate-pulse">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                                    <div className="flex-1">
                                        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2" />
                                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <EmptyState
                    icon={FiFlag}
                    title="No Reports"
                    description="You haven't submitted any reports yet. If you find a suspicious listing, you can report it from the pet detail page."
                    action={{
                        label: 'Browse Pets',
                        onClick: () => window.location.href = ROUTES.BROWSE,
                    }}
                />
            ) : (
                <>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {reports.map((report) => {
                                const pet = report.pet;
                                const status = statusConfig[report.status] || statusConfig.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={report._id}
                                        variants={fadeUp}
                                        exit={{ opacity: 0, x: -20 }}
                                        layout
                                    >
                                        <Card padding="md" hover className="overflow-hidden">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Pet Image */}
                                                {pet && (
                                                    <Link
                                                        to={ROUTES.PET_DETAIL(pet._id)}
                                                        className="flex-shrink-0 w-full sm:w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700"
                                                    >
                                                        <LazyImage
                                                            src={pet.images?.[0]?.url || '/placeholder-pet.svg'}
                                                            alt={pet.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </Link>
                                                )}

                                                {/* Report Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge variant={status.variant} size="sm">
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    {status.label}
                                                                </Badge>
                                                                <Badge variant="default" size="sm">
                                                                    {reasonLabel(report.reason)}
                                                                </Badge>
                                                            </div>
                                                            {pet ? (
                                                                <Link
                                                                    to={ROUTES.PET_DETAIL(pet._id)}
                                                                    className="text-base font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                                                >
                                                                    Reported: {pet.name}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-base text-neutral-500 dark:text-neutral-400 italic">
                                                                    Pet listing removed
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeleteId(report._id);
                                                                setDeleteReportInfo(pet?.name || 'this report');
                                                            }}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                                                            title="Delete report"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {report.description && (
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                                                            {report.description}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                        <span>Reported {formatRelativeTime(report.createdAt)}</span>
                                                        <span>·</span>
                                                        <span>{formatDate(report.createdAt)}</span>
                                                        {report.reviewedAt && (
                                                            <>
                                                                <span>·</span>
                                                                <span>Reviewed {formatRelativeTime(report.reviewedAt)}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Resolution */}
                                                    {report.resolution && (
                                                        <div className="mt-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                <strong className="text-neutral-700 dark:text-neutral-300">
                                                                    Resolution:
                                                                </strong>{' '}
                                                                {report.resolution}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={isFetching}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => {
                    setDeleteId(null);
                    setDeleteReportInfo('');
                }}
                onConfirm={handleDelete}
                title="Delete Report"
                message={`Are you sure you want to delete your report for ${deleteReportInfo}? This action cannot be undone.`}
                variant="warning"
                confirmLabel="Delete Report"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default MyReportsPage;