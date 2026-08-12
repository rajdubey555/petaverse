import { memo } from 'react';
import { FiMail, FiShield, FiUserCheck, FiUserX, FiExternalLink } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';
import UserAvatar from '../user/UserAvatar';

const UserRow = ({ user, index, onToggleStatus, onView, isToggling = false }) => {
    const isActive = user.isActive;
    const isAdmin = user.role === 'admin';

    const handleToggle = () => {
        if (onToggleStatus) {
            onToggleStatus(user._id, !isActive);
        }
    };

    return (
        <tr
            className={cn(
                'transition-colors duration-150 border-b border-neutral-100 dark:border-neutral-800/60',
                'hover:bg-amber-50/40 dark:hover:bg-neutral-800/60',
                !isActive && 'bg-red-50/20 dark:bg-red-950/10'
            )}
        >
            {/* Avatar + Name + Email */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        src={user.avatar?.url}
                        name={user.name}
                        size="md"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                                {user.name}
                            </p>
                            {isAdmin && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-extrabold text-[10px] uppercase tracking-wider">
                                    Admin ⭐
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                            <FiMail className="w-3 h-3 text-neutral-400" />
                            <span className="truncate max-w-[180px]">{user.email}</span>
                        </p>
                    </div>
                </div>
            </td>

            {/* Role Badge */}
            <td className="px-5 py-4">
                <Badge
                    variant={isAdmin ? 'purple' : 'neutral'}
                    size="sm"
                >
                    {isAdmin ? 'Administrator' : 'Standard User'}
                </Badge>
            </td>

            {/* Listings Count */}
            <td className="px-5 py-4 text-center">
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-black text-neutral-800 dark:text-neutral-200">
                    {user.listingCount ?? 0}
                </span>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <Badge
                    variant={isActive ? 'success' : 'error'}
                    size="sm"
                    dot
                >
                    {isActive ? 'Active' : 'Deactivated'}
                </Badge>
            </td>

            {/* Joined Date */}
            <td className="px-5 py-4">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {formatDate(user.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView?.(user._id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all flex items-center gap-1"
                        aria-label={`View ${user.name}`}
                    >
                        <span>View</span>
                        <FiExternalLink className="w-3 h-3" />
                    </button>

                    {!isAdmin && (
                        <button
                            type="button"
                            onClick={handleToggle}
                            disabled={isToggling}
                            className={cn(
                                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50',
                                isActive
                                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/40'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            )}
                        >
                            {isActive ? (
                                <>
                                    <FiUserX className="w-3.5 h-3.5" />
                                    <span>Deactivate</span>
                                </>
                            ) : (
                                <>
                                    <FiUserCheck className="w-3.5 h-3.5" />
                                    <span>Activate</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default memo(UserRow);