import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiAlertTriangle,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiXCircle,
    FiEye,
    FiClock,
    FiUser,
    FiHeart,
    FiCheck,
    FiX,
    FiFilter,
    FiShield,
    FiMessageSquare,
    FiArrowRight,
} from 'react-icons/fi';
import {
    useGetAdminReportsQuery,
    useUpdateReportStatusMutation,
    useDeleteAdminPetMutation,
    useToggleUserStatusMutation,
} from '../../store/api/adminApi';
import { ROUTES, build } from '../../config/routes';
import { PAGINATION } from '../../config/constants';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import SEO from '../../components/common/SEO';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import UserAvatar from '../../components/user/UserAvatar';
import { cn } from '../../utils/cn';

const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const reasonLabels = {
    inappropriate_content: 'Inappropriate Content',
    spam: 'Spam',
    misleading_information: 'Misleading Information',
    duplicate_listing: 'Duplicate Listing',
    sold_or_adopted: 'Sold / Adopted',
    harmful_or_dangerous: 'Harmful / Dangerous',
    other: 'Other',
};

const statusConfig = {
    pending: {
        variant: 'warning',
        icon: FiClock,
        label: 'Pending Review',
        bgGradient: 'from-amber-500/10 to-orange-500/5',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-700 dark:text-amber-300',
    },
    reviewed: {
        variant: 'info',
        icon: FiEye,
        label: 'Under Review',
        bgGradient: 'from-blue-500/10 to-indigo-500/5',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-700 dark:text-blue-300',
    },
    resolved: {
        variant: 'success',
        icon: FiCheckCircle,
        label: 'Resolved',
        bgGradient: 'from-emerald-500/10 to-teal-500/5',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-700 dark:text-emerald-300',
    },
    dismissed: {
        variant: 'neutral',
        icon: FiXCircle,
        label: 'Dismissed',
        bgGradient: 'from-neutral-500/10 to-neutral-600/5',
        borderColor: 'border-neutral-300 dark:border-neutral-700',
        textColor: 'text-neutral-600 dark:text-neutral-400',
    },
};

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'reviewed', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
];

const reasonOptions = [
    { value: '', label: 'All Reasons' },
    ...Object.entries(reasonLabels).map(([value, label]) => ({ value, label })),
];

const AdminReportsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [statusFilter, setStatusFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const queryParams = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...(statusFilter && { status: statusFilter }),
        ...(reasonFilter && { reason: reasonFilter }),
    };

    const { data, isLoading, isFetching, isError, error, refetch } =
        useGetAdminReportsQuery(queryParams);

    const [updateReportStatus] = useUpdateReportStatusMutation();
    const [deleteAdminPet] = useDeleteAdminPetMutation();
    const [toggleUserStatus] = useToggleUserStatusMutation();

    const reports = data?.data || [];
    const pagination = data?.pagination;

    // Calculate Summary Stats from loaded data
    const totalReports = pagination?.totalItems || reports.length;
    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
    const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleReasonChange = useCallback((value) => {
        setReasonFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleResetFilters = useCallback(() => {
        setStatusFilter('');
        setReasonFilter('');
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleOpenModal = useCallback((report) => {
        setSelectedReport(report);
        setAdminNotes(report.adminNotes || '');
    }, []);

    const handleUpdateStatus = useCallback(
        async (reportId, newStatus, customNotes) => {
            setActionLoadingId(reportId);
            try {
                await updateReportStatus({
                    id: reportId,
                    status: newStatus,
                    adminNotes: customNotes !== undefined ? customNotes : adminNotes,
                }).unwrap();
                if (selectedReport && selectedReport._id === reportId) {
                    setSelectedReport((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  status: newStatus,
                                  adminNotes:
                                      customNotes !== undefined ? customNotes : adminNotes,
                              }
                            : null
                    );
                }
            } catch (err) {
                console.error('Failed to update report status:', err);
            } finally {
                setActionLoadingId(null);
            }
        },
        [adminNotes, selectedReport, updateReportStatus]
    );

    const handleDeleteTargetPet = useCallback(async () => {
        if (!selectedReport?.pet?._id) return;
        setActionLoadingId(selectedReport._id);
        try {
            await deleteAdminPet(selectedReport.pet._id).unwrap();
            await updateReportStatus({
                id: selectedReport._id,
                status: 'resolved',
                adminNotes: adminNotes || 'Pet listing removed by admin due to report.',
            }).unwrap();
            setSelectedReport(null);
        } catch (err) {
            console.error('Failed to remove pet:', err);
        } finally {
            setActionLoadingId(null);
        }
    }, [adminNotes, deleteAdminPet, selectedReport, updateReportStatus]);

    const handleDeactivateTargetUser = useCallback(async () => {
        if (!selectedReport?.reportedUser?._id) return;
        setActionLoadingId(selectedReport._id);
        try {
            await toggleUserStatus({
                id: selectedReport.reportedUser._id,
                isActive: false,
            }).unwrap();
            await updateReportStatus({
                id: selectedReport._id,
                status: 'resolved',
                adminNotes: adminNotes || 'User account deactivated by admin due to report.',
            }).unwrap();
            setSelectedReport(null);
        } catch (err) {
            console.error('Failed to deactivate user:', err);
        } finally {
            setActionLoadingId(null);
        }
    }, [adminNotes, selectedReport, toggleUserStatus, updateReportStatus]);

    const handleViewPet = useCallback(
        (petId) => {
            if (petId) navigate(build.petDetail(petId));
        },
        [navigate]
    );

    const handleViewReporter = useCallback(
        (userId) => {
            if (userId) navigate(build.profile(userId));
        },
        [navigate]
    );

    const hasFilters = statusFilter || reasonFilter;
    const isEmpty = !isLoading && !isError && reports.length === 0;

    return (
        <>
            <SEO title="Manage Reports | Admin" noindex />

            {/* Report Detail Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <Modal
                        isOpen={!!selectedReport}
                        onClose={() => setSelectedReport(null)}
                        title="Report Details & Moderation Action"
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Status & Reason Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                <div className="flex items-center gap-2.5">
                                    {(() => {
                                        const config =
                                            statusConfig[selectedReport.status] ||
                                            statusConfig.pending;
                                        return (
                                            <Badge variant={config.variant} size="md" dot>
                                                {config.label}
                                            </Badge>
                                        );
                                    })()}
                                    <Badge variant="neutral" size="md">
                                        {reasonLabels[selectedReport.reason] || selectedReport.reason}
                                    </Badge>
                                </div>
                                <span className="text-xs font-semibold text-neutral-400">
                                    Report ID: <code className="text-neutral-600 dark:text-neutral-300">{selectedReport._id}</code>
                                </span>
                            </div>

                            {/* Description Quote Box */}
                            <div>
                                <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                    Report Reason / User Complaint
                                </h4>
                                <div className="text-sm text-neutral-800 dark:text-neutral-200 bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl p-4 leading-relaxed font-medium">
                                    "{selectedReport.description || 'No additional description provided by reporter.'}"
                                </div>
                            </div>

                            {/* Target & Reporter Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Reporter */}
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                        Reported By
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => handleViewReporter(selectedReport.reporter?._id)}
                                        className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-all w-full text-left border border-neutral-200 dark:border-neutral-700 group shadow-sm"
                                    >
                                        <UserAvatar
                                            src={selectedReport.reporter?.avatar?.url}
                                            name={selectedReport.reporter?.name}
                                            size="sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {selectedReport.reporter?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                                {selectedReport.reporter?.email || '—'}
                                            </p>
                                        </div>
                                        <FiArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>

                                {/* Target */}
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                        Target Item ({selectedReport.reportedUser ? 'User Profile' : 'Pet Listing'})
                                    </h4>
                                    {selectedReport.reportedUser ? (
                                        <button
                                            type="button"
                                            onClick={() => handleViewReporter(selectedReport.reportedUser?._id)}
                                            className="flex items-center gap-3 p-3.5 bg-red-500/10 dark:bg-red-500/20 rounded-2xl hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all w-full text-left border border-red-500/30 group shadow-sm"
                                        >
                                            <UserAvatar
                                                src={selectedReport.reportedUser?.avatar?.url}
                                                name={selectedReport.reportedUser?.name}
                                                size="sm"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-extrabold text-red-900 dark:text-red-300 truncate">
                                                    👤 {selectedReport.reportedUser?.name || 'Reported Profile'}
                                                </p>
                                                <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold truncate">
                                                    Click to inspect profile →
                                                </p>
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleViewPet(selectedReport.pet?._id)}
                                            className="flex items-center gap-3 p-3.5 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl hover:bg-amber-500/20 dark:hover:bg-amber-500/30 transition-all w-full text-left border border-amber-500/30 group shadow-sm"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                                                🐾
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-extrabold text-amber-900 dark:text-amber-300 truncate">
                                                    {selectedReport.pet?.name || 'Reported Pet Listing'}
                                                </p>
                                                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                                                    Click to view live pet page →
                                                </p>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Admin Resolution Section */}
                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
                                <h4 className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                                    Take Moderate Action
                                </h4>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Admin Resolution Notes (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add internal notes about enforcement taken or reason for closing..."
                                        className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    {selectedReport.pet?._id && (
                                        <button
                                            type="button"
                                            disabled={actionLoadingId === selectedReport._id}
                                            onClick={handleDeleteTargetPet}
                                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                                        >
                                            <FiXCircle className="w-4 h-4" />
                                            <span>Remove Pet Listing & Resolve</span>
                                        </button>
                                    )}

                                    {selectedReport.reportedUser?._id && (
                                        <button
                                            type="button"
                                            disabled={actionLoadingId === selectedReport._id}
                                            onClick={handleDeactivateTargetUser}
                                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                                        >
                                            <FiAlertTriangle className="w-4 h-4" />
                                            <span>Suspend User & Resolve</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        disabled={actionLoadingId === selectedReport._id}
                                        onClick={() => handleUpdateStatus(selectedReport._id, 'resolved')}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        <span>Mark as Resolved</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={actionLoadingId === selectedReport._id}
                                        onClick={() => handleUpdateStatus(selectedReport._id, 'dismissed')}
                                        className="px-5 py-2.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <FiX className="w-4 h-4" />
                                        <span>Dismiss Report</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={actionLoadingId === selectedReport._id}
                                        onClick={() => handleUpdateStatus(selectedReport._id, 'reviewed')}
                                        className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-2"
                                    >
                                        <FiEye className="w-4 h-4" />
                                        <span>Mark Under Review</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            <motion.div className="space-y-6 pb-12" initial="initial" animate="animate" variants={stagger}>
                {/* Top Header */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    variants={fadeUp}
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                            Manage Reports
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                            Review, inspect, and moderate flagged pets or user profiles across PetVerse
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={refetch}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm self-start sm:self-auto"
                    >
                        <FiRefreshCw className={cn('w-3.5 h-3.5 text-amber-500', isFetching && 'animate-spin')} />
                        <span>Refresh List</span>
                    </button>
                </motion.div>

                {/* KPI Summary Cards */}
                <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" variants={fadeUp}>
                    <div className="bg-white dark:bg-neutral-800/90 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Reports</span>
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                <FiShield className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2">{totalReports}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800/90 rounded-2xl p-4 border border-amber-200 dark:border-amber-900/40 shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <FiClock className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{pendingCount}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800/90 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/40 shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Resolved</span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <FiCheckCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{resolvedCount}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800/90 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dismissed</span>
                            <div className="w-8 h-8 rounded-xl bg-neutral-500/10 text-neutral-400 flex items-center justify-center">
                                <FiXCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-neutral-700 dark:text-neutral-300 mt-2">{dismissedCount}</p>
                    </div>
                </motion.div>

                {/* Filter Control Bar */}
                <motion.div className="bg-white dark:bg-neutral-800/90 rounded-2xl p-3.5 border border-neutral-200 dark:border-neutral-700 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3" variants={fadeUp}>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 px-1 self-start sm:self-auto">
                            <FiFilter className="w-4 h-4 text-amber-500" />
                            <span>Filters:</span>
                        </div>
                        <Select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            options={statusOptions}
                            className="w-full sm:w-44"
                        />
                        <Select
                            value={reasonFilter}
                            onChange={handleReasonChange}
                            options={reasonOptions}
                            className="w-full sm:w-52"
                        />
                    </div>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline px-2 py-1 self-end sm:self-auto"
                        >
                            Reset Filters ✕
                        </button>
                    )}
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div className="flex items-center justify-center py-24 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft" variants={fadeUp}>
                        <Spinner size="lg" variant="primary" label="Loading reports database..." />
                    </motion.div>
                )}

                {/* Error State */}
                {!isLoading && isError && (
                    <motion.div
                        className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-3xl p-8 text-center"
                        variants={fadeUp}
                    >
                        <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-red-900 dark:text-red-300 mb-1">
                            Failed to Load Reports
                        </h3>
                        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                            {error?.data?.message || error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button type="button" onClick={refetch} className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow">
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {isEmpty && (
                    <motion.div
                        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-12 text-center shadow-soft"
                        variants={fadeUp}
                    >
                        <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100 mb-1">
                            {hasFilters ? 'No Matching Reports' : 'No Flagged Reports Found'}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {hasFilters
                                ? 'No reports match your selected status or reason filters.'
                                : 'All reports have been reviewed or no platform items have been reported.'}
                        </p>
                    </motion.div>
                )}

                {/* Reports List Cards — Ultra Modern Layout */}
                {!isLoading && !isError && !isEmpty && (
                    <motion.div className="space-y-4" variants={stagger}>
                        {reports.map((report) => {
                            const config = statusConfig[report.status] || statusConfig.pending;
                            const StatusIcon = config.icon;
                            const isPending = report.status === 'pending';

                            return (
                                <motion.div key={report._id} variants={fadeUp}>
                                    <div className={cn(
                                        "bg-white dark:bg-neutral-800/90 rounded-2xl border transition-all duration-200 shadow-soft hover:shadow-md overflow-hidden",
                                        isPending ? "border-amber-300 dark:border-amber-800/50" : "border-neutral-200 dark:border-neutral-700/80"
                                    )}>
                                        <div className="p-5 sm:p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                                {/* Left Content */}
                                                <div className="flex-1 space-y-3">
                                                    {/* Badges Bar */}
                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        <Badge variant={config.variant} size="sm" dot>
                                                            {config.label}
                                                        </Badge>

                                                        <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700/60 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-extrabold">
                                                            {reasonLabels[report.reason] || report.reason}
                                                        </span>

                                                        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                                                            {formatRelativeTime(report.createdAt)}
                                                        </span>
                                                    </div>

                                                    {/* Report Description Quote Box */}
                                                    <div className="bg-neutral-50 dark:bg-neutral-900/60 border-l-4 border-amber-500 rounded-r-xl p-3.5">
                                                        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium italic leading-relaxed">
                                                            "{report.description || 'No description provided.'}"
                                                        </p>
                                                    </div>

                                                    {/* Target & Reporter Metadata Bar */}
                                                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                                                        <div className="flex items-center gap-2 bg-neutral-100/80 dark:bg-neutral-700/50 px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
                                                            <UserAvatar
                                                                src={report.reporter?.avatar?.url}
                                                                name={report.reporter?.name}
                                                                size="xs"
                                                            />
                                                            <span className="text-neutral-500 dark:text-neutral-400">Reporter:</span>
                                                            <strong className="text-neutral-900 dark:text-neutral-100 font-bold">
                                                                {report.reporter?.name || 'Anonymous'}
                                                            </strong>
                                                        </div>

                                                        <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
                                                            <span className="text-amber-700 dark:text-amber-300 font-medium">Target:</span>
                                                            <strong className="text-amber-800 dark:text-amber-200 font-extrabold">
                                                                {report.pet?.name
                                                                    ? `🐾 Pet: ${report.pet.name}`
                                                                    : report.reportedUser?.name
                                                                    ? `👤 User: ${report.reportedUser.name}`
                                                                    : 'Platform Item'}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Action Buttons */}
                                                <div className="flex flex-wrap items-center gap-2 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-700/80">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenModal(report)}
                                                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                                                    >
                                                        <FiEye className="w-3.5 h-3.5" />
                                                        <span>Inspect & Act</span>
                                                    </button>

                                                    {isPending && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={actionLoadingId === report._id}
                                                                onClick={() => handleUpdateStatus(report._id, 'resolved')}
                                                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                                            >
                                                                Resolve
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={actionLoadingId === report._id}
                                                                onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                                                                className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-xl transition-all"
                                                            >
                                                                Dismiss
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && !isLoading && !isError && (
                    <motion.div className="flex justify-center pt-4" variants={fadeUp}>
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            onPageChange={handlePageChange}
                        />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default AdminReportsPage;