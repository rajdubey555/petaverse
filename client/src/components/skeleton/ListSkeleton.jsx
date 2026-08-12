/**
 * ListSkeleton — Animated placeholder for list views (saved pets, my listings, reports).
 */
const ListSkeleton = ({ count = 5, className = '' }) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                </div>
            ))}
        </div>
    );
};

export default ListSkeleton;