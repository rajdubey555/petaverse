import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiUsers,
    FiHeart,
    FiAlertTriangle,
    FiStar,
    FiEye,
    FiActivity,
    FiArrowRight,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiPlusCircle,
    FiShield,
} from 'react-icons/fi';
import { useGetDashboardQuery } from '../../store/api/adminApi';
import { ROUTES } from '../../config/routes';
import SEO from '../../components/common/SEO';
import Spinner from '../../components/common/Spinner';
import UserAvatar from '../../components/user/UserAvatar';
import LazyImage from '../../components/common/LazyImage';
import { cn } from '../../utils/cn';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';

const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const speciesIcons = {
    dog: '🐕',
    cat: '🐈',
    bird: '🐦',
    fish: '🐟',
    rabbit: '🐰',
    hamster: '🐹',
    reptile: '🦎',
    other: '🐾',
};

const quickActions = [
    {
        label: 'Manage Users',
        description: 'View, activate, or deactivate user accounts',
        to: ROUTES.ADMIN.USERS,
        icon: FiUsers,
        gradient: 'from-blue-500 to-indigo-600',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
        label: 'Manage Pets',
        description: 'Review, feature, or remove pet listings',
        to: ROUTES.ADMIN.PETS,
        icon: FiHeart,
        gradient: 'from-amber-500 to-orange-600',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
        label: 'Manage Reports',
        description: 'Review and resolve reported content & profiles',
        to: ROUTES.ADMIN.REPORTS,
        icon: FiAlertTriangle,
        gradient: 'from-red-500 to-rose-600',
        badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
];

const AdminDashboardPage = () => {
    const { data, isLoading, isError, error, refetch } = useGetDashboardQuery();
    const [isRefetching, setIsRefetching] = useState(false);

    const dashboard = data?.data || {};
    const statsData = dashboard.stats || {};
    const recentPets = dashboard.recentPets || [];
    const recentUsers = dashboard.recentUsers || [];
    const recentReports = dashboard.recentReports || [];
    const speciesBreakdown = dashboard.speciesBreakdown || {};

    const handleRefresh = async () => {
        setIsRefetching(true);
        await refetch();
        setIsRefetching(false);
    };

    const activeRatio = useMemo(() => {
        if (!statsData.totalUsers) return 100;
        return Math.round((statsData.activeUsers / statsData.totalUsers) * 100);
    }, [statsData.activeUsers, statsData.totalUsers]);

    const totalSpeciesPets = useMemo(() => {
        return Object.values(speciesBreakdown).reduce((acc, curr) => acc + curr, 0);
    }, [speciesBreakdown]);

    return (
        <>
            <SEO title="Admin Dashboard Overview" noindex />

            <motion.div className="space-y-8 pb-10" initial="initial" animate="animate" variants={stagger}>
                {/* ─────────────────────────────────────────────────────────
                    1. ADMIN WELCOME & HEADER BANNER
                ───────────────────────────────────────────────────────── */}
                <motion.div
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 sm:p-8 shadow-xl border border-neutral-700/60"
                    variants={fadeUp}
                >
                    {/* Ambient Glow Effects */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">

                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                                Platform Overview
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                                Monitor real-time platform activity, manage registered users, inspect pet listings, and resolve reports.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefetching || isLoading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all shadow-md disabled:opacity-50"
                            >
                                <FiRefreshCw className={cn('w-4 h-4', isRefetching && 'animate-spin')} />
                                <span>{isRefetching ? 'Refreshing...' : 'Refresh Metrics'}</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* ─────────────────────────────────────────────────────────
                    2. LOADING & ERROR STATES
                ───────────────────────────────────────────────────────── */}
                {isLoading && (
                    <div className="flex items-center justify-center py-24 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft">
                        <Spinner size="lg" variant="primary" label="Fetching live admin metrics..." />
                    </div>
                )}

                {!isLoading && isError && (
                    <motion.div
                        className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-3xl p-8 text-center shadow-lg"
                        variants={fadeUp}
                    >
                        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-1">
                            Unable to Sync Admin Metrics
                        </h3>
                        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-5 max-w-md mx-auto">
                            {error?.data?.message || error?.message || 'An unexpected error occurred while fetching database metrics.'}
                        </p>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                        >
                            Retry Connection
                        </button>
                    </motion.div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    3. REAL-TIME STATS METRICS GRID
                ───────────────────────────────────────────────────────── */}
                {!isLoading && !isError && (
                    <>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
                            variants={fadeUp}
                        >
                            {/* Card 1: Total Users */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Total Users
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <FiUsers className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100">
                                        {statsData.totalUsers ?? 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                                        {statsData.activeUsers ?? 0} Active ({activeRatio}%)
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Total Pet Listings */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Total Pets
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <FiHeart className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100">
                                        {statsData.totalPets ?? 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">
                                        {statsData.activeListings ?? 0} Live Listings
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Total Views */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Total Views
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <FiEye className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100">
                                        {(statsData.totalViews ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 mt-1">
                                        Across all listings
                                    </p>
                                </div>
                            </div>

                            {/* Card 4: Featured Listings */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Featured
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                        <FiStar className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100">
                                        {statsData.featuredListings ?? 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                                        Promoted Listings
                                    </p>
                                </div>
                            </div>

                            {/* Card 5: Pending Reports */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Pending Reports
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                                        <FiAlertTriangle className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400">
                                        {statsData.pendingReports ?? 0}
                                    </p>
                                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                                        Of {statsData.totalReports ?? 0} total reports
                                    </p>
                                </div>
                            </div>

                            {/* Card 6: System Status */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                        System Status
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <FiCheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        Healthy
                                    </p>
                                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                                        MongoDB Synced
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ─────────────────────────────────────────────────────────
                            4. REAL RECENT DATA SECTIONS (USERS, PETS & REPORTS)
                        ───────────────────────────────────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Column 1: Recent Pet Listings */}
                            <motion.div
                                variants={fadeUp}
                                className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                                                🐶
                                            </div>
                                            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                                Recent Pets
                                            </h2>
                                        </div>
                                        <Link
                                            to={ROUTES.ADMIN.PETS}
                                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>View All</span>
                                            <FiArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {recentPets.length === 0 ? (
                                        <p className="text-xs text-neutral-400 py-6 text-center">No pet listings found in database.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentPets.map((pet) => (
                                                <div
                                                    key={pet._id}
                                                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0 border border-neutral-200 dark:border-neutral-600">
                                                            {pet.images?.[0]?.url ? (
                                                                <img
                                                                    src={pet.images[0].url}
                                                                    alt={pet.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-lg">
                                                                    {speciesIcons[pet.species] || '🐾'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <Link
                                                                to={`/pets/${pet._id}`}
                                                                className="text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:text-amber-600 truncate block"
                                                            >
                                                                {pet.name}
                                                            </Link>
                                                            <p className="text-[11px] text-neutral-400 truncate">
                                                                {pet.species} • {pet.owner?.name || 'Unknown Owner'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex-shrink-0">
                                                        {pet.listingType === 'adoption' ? 'Adoption' : formatPrice(pet.price) || 'Free'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Column 2: Recent Users */}
                            <motion.div
                                variants={fadeUp}
                                className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                                👤
                                            </div>
                                            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                                Recent Users
                                            </h2>
                                        </div>
                                        <Link
                                            to={ROUTES.ADMIN.USERS}
                                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>View All</span>
                                            <FiArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {recentUsers.length === 0 ? (
                                        <p className="text-xs text-neutral-400 py-6 text-center">No users found in database.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentUsers.map((user) => (
                                                <div
                                                    key={user._id}
                                                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <UserAvatar
                                                            src={user.avatar?.url}
                                                            name={user.name}
                                                            size="sm"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-[11px] text-neutral-400 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        'text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0',
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                                    )}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Column 3: Recent Reports / Action Items */}
                            <motion.div
                                variants={fadeUp}
                                className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                                                🚨
                                            </div>
                                            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                                Recent Reports
                                            </h2>
                                        </div>
                                        <Link
                                            to={ROUTES.ADMIN.REPORTS}
                                            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>View All</span>
                                            <FiArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {recentReports.length === 0 ? (
                                        <div className="py-8 text-center space-y-2">
                                            <FiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                                            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">All clear!</p>
                                            <p className="text-[11px] text-neutral-400">No pending reports flagged by users.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentReports.map((report) => (
                                                <div
                                                    key={report._id}
                                                    className="p-3 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 space-y-1.5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-extrabold text-red-700 dark:text-red-300 capitalize">
                                                            {report.reason?.replace('-', ' ') || 'Reported'}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400">
                                                            {formatRelativeTime(report.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium truncate">
                                                        By {report.reporter?.name || 'Anonymous'} → {report.pet?.name ? `Pet: ${report.pet.name}` : report.reportedUser?.name ? `User: ${report.reportedUser.name}` : 'Item'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to={ROUTES.ADMIN.REPORTS}
                                    className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-700 dark:text-red-300 font-bold text-xs rounded-xl text-center transition-colors block border border-red-200 dark:border-red-800/40"
                                >
                                    Manage All Reports ({statsData.pendingReports ?? 0} Pending)
                                </Link>
                            </motion.div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────
                            5. SPECIES DISTRIBUTION BREAKDOWN (REAL DATA)
                        ───────────────────────────────────────────────────────── */}
                        <motion.div
                            variants={fadeUp}
                            className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft space-y-4"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
                                <div>
                                    <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                        Species Distribution Breakdown
                                    </h2>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Live database breakdown of active listings by species
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-extrabold">
                                    {statsData.activeListings ?? 0} Active Listings
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                                {Object.entries(speciesIcons).map(([speciesKey, emoji]) => {
                                    const count = speciesBreakdown[speciesKey] || 0;
                                    const pct = totalSpeciesPets > 0 ? Math.round((count / totalSpeciesPets) * 100) : 0;
                                    return (
                                        <div
                                            key={speciesKey}
                                            className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-100 dark:border-neutral-700 text-center space-y-1"
                                        >
                                            <span className="text-2xl select-none">{emoji}</span>
                                            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                                                {speciesKey}
                                            </p>
                                            <p className="text-sm font-black text-amber-600 dark:text-amber-400">
                                                {count}
                                            </p>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-1 overflow-hidden mt-1">
                                                <div
                                                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* ─────────────────────────────────────────────────────────
                            6. QUICK ADMIN MANAGEMENT CARDS
                        ───────────────────────────────────────────────────────── */}
                        <motion.div variants={fadeUp} className="space-y-4">
                            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                                Quick Management Shortcuts
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.to}
                                        to={action.to}
                                        className="group relative bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={cn(
                                                'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300',
                                                action.gradient
                                            )}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <FiArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                        </div>

                                        <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                                            {action.label}
                                        </h3>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {action.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </>
    );
};

export default AdminDashboardPage;