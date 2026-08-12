/**
 * ProfileSkeleton — Animated placeholder for user profile pages.
 */
const ProfileSkeleton = ({ className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {/* Cover area */}
            <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-16 relative">
                {/* Avatar */}
                <div className="absolute -bottom-10 left-6 w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white dark:border-gray-800" />
            </div>

            {/* Name + meta */}
            <div className="px-6 space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 px-6 mt-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
        </div>
    );
};

export default ProfileSkeleton;