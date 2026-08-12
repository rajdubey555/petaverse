/**
 * FormSkeleton — Animated placeholder for form pages (create pet, edit profile, etc).
 */
const FormSkeleton = ({ className = '' }) => {
    return (
        <div className={`animate-pulse space-y-5 ${className}`}>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-6" />

            {/* Field rows */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
                    <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-14" />
                    <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32" />
            </div>
        </div>
    );
};

export default FormSkeleton;