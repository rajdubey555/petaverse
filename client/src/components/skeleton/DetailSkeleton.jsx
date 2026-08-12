/**
 * DetailSkeleton — Animated placeholder for detail pages (pet detail, user profile, etc).
 */
const DetailSkeleton = ({ className = '' }) => {
    return (
        <div className={`animate-pulse space-y-6 ${className}`}>
            {/* Image gallery */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl" />

            {/* Title */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/6" />
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
        </div>
    );
};

export default DetailSkeleton;