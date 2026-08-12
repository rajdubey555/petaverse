/**
 * TableSkeleton — Animated placeholder for admin table views.
 */
const TableSkeleton = ({ rows = 8, columns = 5, className = '' }) => {
    return (
        <div className={`overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 animate-pulse">
                <div className="flex gap-6">
                    {Array.from({ length: columns }, (_, i) => (
                        <div
                            key={`h-${i}`}
                            className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            style={{ width: `${Math.max(10, 20 - i * 2)}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {Array.from({ length: rows }, (_, i) => (
                    <div
                        key={`r-${i}`}
                        className="flex gap-6 p-4 animate-pulse"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        {Array.from({ length: columns }, (_, j) => (
                            <div
                                key={`c-${j}`}
                                className="h-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                style={{ width: `${Math.max(8, 18 - j * 2)}%` }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;