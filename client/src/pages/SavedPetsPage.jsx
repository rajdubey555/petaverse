import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart,
  FiTrash2,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { useGetSavedPetsQuery, useUnsavePetMutation } from '../store/api/savedPetApi';
import { ROUTES } from '../config/routes';
import { PAGINATION } from '../config/constants';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LazyImage from '../components/common/LazyImage';
import ListingTypeBadge from '../components/pet/ListingTypeBadge';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const SavedPetsPage = () => {
  const [page, setPage] = useState(1);
  const [unsaveId, setUnsaveId] = useState(null);
  const [unsavePetName, setUnsavePetName] = useState('');

  const { data, isLoading, isFetching, error } = useGetSavedPetsQuery({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
  });
  const [unsavePet, { isLoading: isUnsaving }] = useUnsavePetMutation();

  const savedPets = data?.data || [];
  const pagination = data?.pagination;

  const handleUnsave = async () => {
    if (!unsaveId) return;
    try {
      await unsavePet(unsaveId).unwrap();
      setUnsaveId(null);
      setUnsavePetName('');
    } catch {
      // Error handled by toast middleware
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Saved Pets
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 ml-13">
          Pets you've saved for later
        </p>
      </motion.div>

      {/* Content */}
      {error ? (
        <EmptyState
          icon={FiAlertCircle}
          title="Failed to Load Saved Pets"
          description="Something went wrong while loading your saved pets."
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload(),
          }}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} padding="none" className="animate-pulse">
              <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : savedPets.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="No Saved Pets"
          description="You haven't saved any pets yet. Browse listings and save the ones you love."
          action={{
            label: 'Browse Pets',
            onClick: () => window.location.href = ROUTES.BROWSE,
          }}
        />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {savedPets.map((saved) => {
                const pet = saved.pet;
                if (!pet) return null;

                return (
                  <motion.div
                    key={saved._id}
                    variants={fadeUp}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card padding="none" hover className="overflow-hidden group">
                      {/* Image */}
                      <Link
                        to={ROUTES.PET_DETAIL(pet._id)}
                        className="block aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700"
                      >
                        <LazyImage
                          src={pet.images?.[0]?.url || '/placeholder-pet.svg'}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={ROUTES.PET_DETAIL(pet._id)}
                            className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                          >
                            {pet.name}
                          </Link>
                          <ListingTypeBadge type={pet.listingType} size="sm" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                          <span>{pet.breed || pet.species}</span>
                          <span>·</span>
                          <span>{pet.location?.city || 'India'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          {pet.price ? (
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {formatPrice(pet.price)}
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              Free
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUnsaveId(pet._id);
                              setUnsavePetName(pet.name);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Remove from saved"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                          Saved {formatRelativeTime(saved.createdAt)}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                isLoading={isFetching}
              />
            </div>
          )}
        </>
      )}

      {/* Unsave Confirmation */}
      <ConfirmDialog
        isOpen={!!unsaveId}
        onClose={() => {
          setUnsaveId(null);
          setUnsavePetName('');
        }}
        onConfirm={handleUnsave}
        title="Remove from Saved"
        message={`Are you sure you want to remove "${unsavePetName}" from your saved pets?`}
        variant="warning"
        confirmLabel="Remove"
        isLoading={isUnsaving}
      />
    </div>
  );
};

export default SavedPetsPage;