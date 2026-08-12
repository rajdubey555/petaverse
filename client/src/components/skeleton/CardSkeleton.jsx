/**
 * CardSkeleton — Animated card placeholder for pet cards and generic cards.
 */
const CardSkeleton = ({ count = 1, className = '' }) => {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse ${className}`}
                >
                    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
                        <div className="flex gap-2 pt-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CardSkeleton;