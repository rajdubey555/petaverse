import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { savedPetApi, useToggleSaveMutation, useCheckSavedQuery } from '../../store/api/savedPetApi';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes';

const SaveButton = ({
  petId,
  isSaved: isSavedProp = false,
  onToggle,
  size = 'md',
  variant = 'icon',
  showLabel = false,
  disabled = false,
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  // Query server for actual saved status when user is authenticated
  const { data: checkData } = useCheckSavedQuery(petId, {
    skip: !isAuthenticated || !petId,
  });

  const [toggleSave, { isLoading: isToggling }] = useToggleSaveMutation();

  // Local optimistic state — null means "use server state"
  const [optimistic, setOptimistic] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Derive saved state: optimistic (in-flight) → server check → prop fallback
  const serverSaved =
    checkData?.data?.saved !== undefined ? Boolean(checkData.data.saved) : Boolean(isSavedProp);
  const isSaved = optimistic !== null ? optimistic : serverSaved;

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || isToggling) return;

      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN);
        return;
      }

      const newState = !isSaved;

      // 1. Set optimistic UI immediately so heart changes colour right away
      setOptimistic(newState);
      setIsAnimating(true);

      try {
        if (onToggle) {
          await onToggle(petId, newState);
        } else {
          await toggleSave(petId).unwrap();
        }

        // 2. After server confirms, patch the checkSaved cache directly
        //    so when we clear optimistic state the server cache already has
        //    the correct value — no flicker.
        dispatch(
          savedPetApi.util.updateQueryData('checkSaved', petId, (draft) => {
            if (draft?.data) {
              draft.data.saved = newState;
            }
          })
        );
      } catch {
        // Revert on server error
        setOptimistic(!newState);
      } finally {
        // Now it's safe to drop optimistic — cache is already updated
        setOptimistic(null);
        setTimeout(() => setIsAnimating(false), 300);
      }
    },
    [isSaved, onToggle, petId, disabled, isToggling, isAuthenticated, navigate, toggleSave, dispatch]
  );

  const sizeClasses = { sm: 'p-1.5', md: 'p-2', lg: 'p-2.5' };
  const iconSizes   = { sm: 16,    md: 20,   lg: 24  };

  const buttonBase = cn(
    'rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size] || sizeClasses.md
  );

  const variantClasses = {
    icon: cn(
      'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-sm',
      'hover:bg-white dark:hover:bg-neutral-700',
      isSaved
        ? 'text-red-500 hover:text-red-600'
        : 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400'
    ),
    ghost: cn(
      isSaved
        ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10'
        : 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
    ),
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isToggling}
      className={cn(buttonBase, variantClasses[variant] || variantClasses.icon, className)}
      aria-label={isSaved ? 'Remove from saved' : 'Save to favorites'}
      aria-pressed={isSaved}
      {...props}
    >
      <FiHeart
        size={iconSizes[size] || iconSizes.md}
        className={cn(
          'transition-all duration-300',
          isSaved
            ? 'fill-red-500 stroke-red-500'          // solid red when saved
            : 'fill-none stroke-current',              // outline only when not saved
          isAnimating && isSaved  && 'scale-125',
          isAnimating && !isSaved && 'scale-90'
        )}
      />
      {showLabel && (
        <span className="ml-1.5 text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default memo(SaveButton);