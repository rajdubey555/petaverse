import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiMail,
  FiPhone,
  FiGrid,
  FiHeart,
  FiEdit,
  FiAlertCircle,
  FiStar,
  FiCheckCircle,
  FiShield,
  FiMessageCircle,
  FiSend,
  FiX,
  FiFlag,
} from 'react-icons/fi';
import {
  useGetPublicProfileQuery,
  useGetUserListingsQuery,
  useRateUserMutation,
} from '../store/api/userApi';
import { useCreateReportMutation } from '../store/api/reportApi';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';
import { PAGINATION } from '../config/constants';
import { formatDate } from '../utils/formatters';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import UserAvatar from '../components/user/UserAvatar';
import PetGrid from '../components/pet/PetGrid';
import Pagination from '../components/common/Pagination';
import ProfileSkeleton from '../components/skeleton/ProfileSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const USER_REPORT_REASONS = [
  { value: 'scam_or_fake_profile', label: 'Fraudulent / Fake User Profile' },
  { value: 'harassment_or_abuse', label: 'Harassment or Abusive Behavior' },
  { value: 'user_impersonation', label: 'Impersonation of Another Person' },
  { value: 'unresponsive_or_ghosting', label: 'Unresponsive or Fraudulent Dealings' },
  { value: 'inappropriate_behavior', label: 'Inappropriate Content or Conduct' },
  { value: 'other', label: 'Other Security Reason' },
];

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  // Rating State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [rateError, setRateError] = useState('');

  // Report User State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('scam_or_fake_profile');
  const [reportDescription, setReportDescription] = useState('');
  const [reportFeedback, setReportFeedback] = useState({ type: '', msg: '' });

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useGetPublicProfileQuery(id);

  const {
    data: listingsData,
    isLoading: listingsLoading,
    isFetching: listingsFetching,
  } = useGetUserListingsQuery({
    id,
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
  });

  const [rateUser, { isLoading: isSubmittingRating }] = useRateUserMutation();
  const [createReport, { isLoading: isSubmittingReport }] = useCreateReportMutation();

  const profile = profileData?.data?.user || profileData?.data;
  const listings = listingsData?.data || [];
  const pagination = listingsData?.pagination;
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = currentUserId === id;

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRateError('');
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      await rateUser({ id, rating: selectedRating, comment: reviewComment }).unwrap();
      setShowRatingModal(false);
      setReviewComment('');
    } catch (err) {
      setRateError(err?.data?.message || 'Failed to submit rating. Please try again.');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportFeedback({ type: '', msg: '' });
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      const res = await createReport({
        reportedUserId: id,
        reason: reportReason,
        description: reportDescription,
      }).unwrap();
      setReportFeedback({ type: 'success', msg: res?.message || 'Report submitted. we will look into it' });
      setTimeout(() => {
        setShowReportModal(false);
        setReportDescription('');
        setReportFeedback({ type: '', msg: '' });
      }, 2000);
    } catch (err) {
      setReportFeedback({ type: 'error', msg: err?.data?.message || 'Failed to submit report.' });
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={FiAlertCircle}
          title="Profile Not Found"
          description="The user profile you're looking for doesn't exist or has been removed."
          action={{
            label: 'Go Back',
            onClick: () => navigate(-1),
          }}
        />
      </div>
    );
  }

  const reviewCount = profile.ratingCount || (profile.ratings ? profile.ratings.length : 0);
  const avgRating = reviewCount > 0 ? (profile.averageRating || 0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Sidebar - Profile Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:col-span-1"
        >
          <Card padding="lg" className="sticky top-24 shadow-md border-neutral-200 dark:border-neutral-700">
            <div className="text-center relative">
              <UserAvatar
                src={profile.avatar?.url}
                alt={profile.name || 'User'}
                size="xl"
                className="mx-auto mb-4 ring-4 ring-primary-100 dark:ring-primary-900/30"
              />
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                {profile.name || 'PetVerse User'}
                <FiCheckCircle className="w-5 h-5 text-primary-500" title="Verified Account" />
              </h1>

              {/* Rating Badge */}
              <div
                onClick={() => !isOwnProfile && setShowRatingModal(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-2.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all",
                  !isOwnProfile && "cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:scale-105"
                )}
                title={!isOwnProfile ? "Click to rate user" : undefined}
              >
                <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
                {reviewCount > 0 ? (
                  <>
                    <span className="text-sm font-bold">{Number(avgRating).toFixed(1)} / 5.0</span>
                    <span className="text-neutral-400">•</span>
                    <span>({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold">New Member</span>
                    <span className="text-neutral-400">•</span>
                    <span>(0 Reviews)</span>
                  </>
                )}
              </div>

              {profile.bio && (
                <p className="text-neutral-600 dark:text-neutral-400 mt-3 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Badges & Trust Metrics */}
            <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-2 justify-center">
              <Badge variant="success" size="sm" dot>Identity Verified</Badge>
              <Badge variant="info" size="sm">Trusted Caretaker</Badge>
              <Badge variant="primary" size="sm">Active Rescuer</Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <FiGrid className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {profile.listingCount || listings.length || 0}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Active Listings
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <FiHeart className="w-4 h-4 text-red-500" />
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {profile.savedCount || 0}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Rehomed Pets
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
              {profile.email && (
                <div className="flex items-center gap-3 text-sm">
                  <FiMail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <a href={`mailto:${profile.email}`} className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 truncate">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <FiPhone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <a href={`tel:${profile.phone}`} className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400">
                    {profile.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <FiMapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {profile.location && (profile.location.city || profile.location.state)
                    ? [profile.location.city, profile.location.state].filter(Boolean).join(', ')
                    : 'India'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiCalendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  Member since {profile.createdAt ? formatDate(profile.createdAt) : 'Recently Joined'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
              {isOwnProfile ? (
                <Link to={ROUTES.SETTINGS}>
                  <Button variant="outline" className="w-full" leftIcon={FiEdit}>
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    leftIcon={FiMessageCircle}
                    onClick={() => navigate(ROUTES.CHAT)}
                  >
                    Message Owner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    leftIcon={FiStar}
                    onClick={() => setShowRatingModal(true)}
                  >
                    Rate & Review User
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    leftIcon={FiAlertCircle}
                    onClick={() => setShowReportModal(true)}
                  >
                    Report User
                  </Button>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Main Content - User's Listings & Reviews */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:col-span-2 mt-8 lg:mt-0 space-y-8"
        >
          {/* Listings Header */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {isOwnProfile ? 'Your Pet Listings' : `Listings by ${profile.name || 'User'}`}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Browse pets listed for adoption, sale, or lost & found
                </p>
              </div>
              {isOwnProfile && (
                <Link to={ROUTES.CREATE_LISTING}>
                  <Button size="sm">
                    + New Listing
                  </Button>
                </Link>
              )}
            </div>

            {listingsLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : listings.length === 0 ? (
              <EmptyState
                icon={FiGrid}
                title="No Listings Yet"
                description={
                  isOwnProfile
                    ? "You haven't created any pet listings yet. Create your first listing to get started."
                    : `${profile.name || 'This user'} hasn't posted any pet listings yet.`
                }
                action={
                  isOwnProfile
                    ? {
                      label: 'Create Listing',
                      onClick: () => navigate(ROUTES.CREATE_LISTING),
                    }
                    : undefined
                }
              />
            ) : (
              <>
                <PetGrid pets={listings} columns={2} />
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                      isLoading={listingsFetching}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* User Reviews Section */}
          {profile.ratings && profile.ratings.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                Community Reviews & Ratings ({profile.ratings.length})
              </h3>
              <div className="space-y-4">
                {profile.ratings.map((rev, index) => (
                  <div key={index} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar src={rev.reviewerAvatar} name={rev.reviewerName} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{rev.reviewerName}</p>
                          <p className="text-[11px] text-neutral-400">{formatDate(rev.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 pl-1">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Interactive Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-700 relative"
            >
              <button
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiStar className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Rate {profile.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Share your experience with this pet caretaker / rescuer
                </p>
              </div>

              {rateError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
                  {rateError}
                </div>
              )}

              <form onSubmit={handleRatingSubmit} className="space-y-5">
                {/* 5-Star Picker */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <FiStar
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= (hoverRating || selectedRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 dark:text-neutral-600"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                    Your Review (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write a brief review about communication, pet care, or response speed..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSubmittingRating}
                    leftIcon={FiSend}
                  >
                    Submit Rating
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Report User Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-700 relative"
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Report User to Admin
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Report suspicious, fake, or abusive user profiles directly to administrators.
                </p>
              </div>

              {reportFeedback.msg && (
                <div
                  className={cn(
                    "p-3 mb-4 rounded-xl text-xs border",
                    reportFeedback.type === 'success'
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300"
                  )}
                >
                  {reportFeedback.msg}
                </div>
              )}

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                    Reason for Reporting
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {USER_REPORT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                    Additional Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe what happened or why this profile violates community safety guidelines..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    className="flex-1"
                    isLoading={isSubmittingReport}
                    leftIcon={FiFlag}
                  >
                    Send Report
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;