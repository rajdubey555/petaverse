import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiRefreshCw, FiAlertCircle, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import { useGetUsersQuery, useToggleUserStatusMutation } from '../../store/api/adminApi';
import { ROUTES, build } from '../../config/routes';
import { PAGINATION } from '../../config/constants';
import SEO from '../../components/common/SEO';
import DataTable from '../../components/admin/DataTable';
import UserRow from '../../components/admin/UserRow';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
};

const columns = [
    { key: 'user', label: 'User Details', sortable: false },
    { key: 'role', label: 'Role', sortable: false, width: '130px' },
    { key: 'listings', label: 'Listings', sortable: false, width: '90px', className: 'text-center' },
    { key: 'status', label: 'Account Status', sortable: false, width: '120px' },
    { key: 'joined', label: 'Registration Date', sortable: false, width: '140px' },
    { key: 'actions', label: 'Actions', sortable: false, width: '200px' },
];

const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'user', label: 'Standard Users' },
    { value: 'admin', label: 'Administrators' },
];

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'true', label: 'Active Users' },
    { value: 'false', label: 'Deactivated Users' },
];

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [toggleConfirm, setToggleConfirm] = useState(null);
    const [togglingIds, setTogglingIds] = useState(new Set());

    const debouncedSearch = useDebounce(search, 400);

    const queryParams = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { isActive: statusFilter === 'true' }),
    };

    const { data, isLoading, isFetching, isError, error, refetch } = useGetUsersQuery(queryParams);
    const [toggleUserStatus] = useToggleUserStatusMutation();

    const users = data?.data || [];
    const pagination = data?.pagination;

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleRoleChange = useCallback((value) => {
        setRoleFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleStatusChange = useCallback((value) => {
        setStatusFilter(value);
        setPage(PAGINATION.DEFAULT_PAGE);
    }, []);

    const handleToggleStatus = useCallback((userId, isActive) => {
        setToggleConfirm({
            userId,
            isActive,
            message: isActive
                ? 'Are you sure you want to activate this user? They will regain full access to their account.'
                : 'Are you sure you want to deactivate this user? They will be immediately logged out and unable to access their account until reactivated.',
            title: isActive ? 'Activate User Account' : 'Deactivate User Account',
        });
    }, []);

    const handleConfirmToggle = useCallback(async () => {
        if (!toggleConfirm) return;
        const { userId, isActive } = toggleConfirm;
        setTogglingIds((prev) => new Set(prev).add(userId));
        try {
            await toggleUserStatus({ id: userId, isActive }).unwrap();
        } finally {
            setTogglingIds((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
            setToggleConfirm(null);
        }
    }, [toggleConfirm, toggleUserStatus]);

    const handleViewUser = useCallback((userId) => {
        navigate(build.profile(userId));
    }, [navigate]);

    const renderRow = useCallback(
        (user, index) => (
            <UserRow
                key={user._id}
                user={user}
                index={index}
                onToggleStatus={handleToggleStatus}
                onView={handleViewUser}
                isToggling={togglingIds.has(user._id)}
            />
        ),
        [handleToggleStatus, handleViewUser, togglingIds]
    );

    const hasFilters = debouncedSearch || roleFilter || statusFilter;
    const isEmpty = !isLoading && !isError && users.length === 0;

    return (
        <>
            <SEO title="Manage Users | Admin" noindex />

            <ConfirmDialog
                isOpen={!!toggleConfirm}
                onClose={() => setToggleConfirm(null)}
                onConfirm={handleConfirmToggle}
                title={toggleConfirm?.title || ''}
                message={toggleConfirm?.message || ''}
                confirmLabel={toggleConfirm?.isActive ? 'Activate User' : 'Deactivate User'}
                variant={toggleConfirm?.isActive ? 'info' : 'danger'}
                isLoading={false}
            />

            <motion.div className="space-y-6 pb-10" initial="initial" animate="animate">
                {/* Header Banner */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    variants={fadeUp}
                >
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                            Search, filter, inspect profiles, and manage user account active statuses
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={refetch}
                        disabled={isFetching}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm self-start"
                    >
                        <FiRefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                        <span>Refresh</span>
                    </button>
                </motion.div>

                {/* Filter Controls Bar */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3"
                    variants={fadeUp}
                >
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search users by name or email..."
                            isLoading={isFetching}
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onChange={handleRoleChange}
                        options={roleOptions}
                        className="sm:w-44"
                    />
                    <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        options={statusOptions}
                        className="sm:w-44"
                    />
                </motion.div>

                {/* Error State */}
                {!isLoading && isError && (
                    <motion.div
                        className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-3xl p-8 text-center"
                        variants={fadeUp}
                    >
                        <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-red-900 dark:text-red-300 mb-1">
                            Failed to Fetch User Records
                        </h3>
                        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                            {error?.data?.message || error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button type="button" onClick={refetch} className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl">
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
                        <FiUsers className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                        <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100 mb-1">
                            {hasFilters ? 'No Users Match Search' : 'No Users Registered'}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {hasFilters
                                ? 'Try clearing your search query or adjusting your role/status filters.'
                                : 'User accounts will appear here once they register.'}
                        </p>
                    </motion.div>
                )}

                {/* Users Table */}
                {!isError && !isEmpty && (
                    <motion.div variants={fadeUp} className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={users}
                            isLoading={isLoading}
                            isError={false}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            renderRow={renderRow}
                            rowKey="_id"
                        />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default AdminUsersPage;