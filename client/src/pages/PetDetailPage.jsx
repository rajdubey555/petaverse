import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiMapPin,
    FiCalendar,
    FiEye,
    FiHeart,
    FiShare2,
    FiAlertTriangle,
    FiChevronLeft,
    FiChevronRight,
    FiTag,
    FiInfo,
    FiShield,
    FiActivity,
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiUser,
    FiClock,
} from 'react-icons/fi';
import { useGetPetByIdQuery, useIncrementViewMutation } from '../store/api/petApi';
import { PetImageCarousel, PetInfo, PetContactCard, ListingTypeBadge, SaveButton, ReportButton, ShareButton } from '../components/pet';
import { Button, Badge, Spinner, EmptyState, Card, LazyImage } from '../components/common';
import { DetailSkeleton } from '../components/skeleton';
import { UserAvatar } from '../components/user';
import { ROUTES } from '../config/routes';
import { SPECIES_CONFIG, LISTING_TYPES } from '../config/constants';
import { formatDate, formatRelativeTime, formatPrice, formatAge } from '../utils/formatters';
import { cn } from '../utils/cn';

const PetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading, isError, error, refetch } = useGetPetByIdQuery(id);
    const [incrementView] = useIncrementViewMutation();

    const pet = response?.data;

    useEffect(() => {
        if (id) {
            incrementView(id).catch(() => { });
        }
    }, [id]);

    useEffect(() => {
        if (pet) {
            document.title = `${pet.name} - ${SPECIES_CONFIG[pet.species]?.label || pet.species} | PetVerse`;
        }
        return () => {
            document.title = 'PetVerse';
        };
    }, [pet]);

    if (isLoading) {
        return <DetailSkeleton />;
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <EmptyState
                    icon={FiAlertTriangle}
                    title="Pet Not Found"
                    description={error?.status === 404 ? 'This pet listing may have been removed or does not exist.' : 'Failed to load pet details. Please try again.'}
                    action={{
                        label: error?.status === 404 ? 'Browse Pets' : 'Try Again',
                        onClick: error?.status === 404 ? () => navigate(ROUTES.BROWSE_PETS) : refetch,
                    }}
                    secondaryAction={error?.status !== 404 ? {
                        label: 'Go Home',
                        to: ROUTES.HOME,
                    } : undefined}
                />
            </div>
        );
    }

    if (!pet) return null;

    const speciesInfo = SPECIES_CONFIG[pet.species];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Back Navigation */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Carousel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <PetImageCarousel images={pet.images} petName={pet.name} />
                        </motion.div>

                        {/* Pet Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {pet.name}
                                        </h1>
                                        <ListingTypeBadge type={pet.listingType} size="md" />
                                        {pet.isFeatured && (
                                            <Badge variant="accent" size="sm" dot>Featured</Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span>{speciesInfo?.icon}</span>
                                            {speciesInfo?.label || pet.species}
                                        </span>
                                        {pet.breed && (
                                            <>
                                                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                                                <span>{pet.breed}</span>
                                            </>
                                        )}
                                        {pet.location?.city && (
                                            <>
                                                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <FiMapPin className="w-3.5 h-3.5" />
                                                    {pet.location.city}, {pet.location.state}
                                                </span>
                                            </>
                                        )}
                                        <span className="text-neutral-300 dark:text-neutral-600">•</span>
                                        <span className="inline-flex items-center gap-1">
                                            <FiEye className="w-3.5 h-3.5" />
                                            {pet.viewCount || 0} views
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <SaveButton petId={pet._id} />
                                    <ShareButton petId={pet._id} petName={pet.name} />
                                    <ReportButton petId={pet._id} />
                                </div>
                            </div>

                            {/* Price */}
                            {pet.listingType !== 'adoption' && pet.price > 0 && (
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                            {formatPrice(pet.price)}
                                        </span>
                                        {pet.isNegotiable && (
                                            <Badge variant="secondary" size="sm">Negotiable</Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Pet Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <PetInfo pet={pet} />
                        </motion.div>

                        {/* Description */}
                        {pet.description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.25 }}
                            >
                                <Card className="p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                                        <FiInfo className="w-5 h-5 text-primary-500" />
                                        About {pet.name}
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                        {pet.description}
                                    </p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Health Status */}
                        {pet.healthStatus?.notes && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <Card className="p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                                        <FiActivity className="w-5 h-5 text-accent-500" />
                                        Health Status
                                    </h2>
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {pet.healthStatus?.vaccinated && (
                                            <Badge variant="success" dot>Vaccinated</Badge>
                                        )}
                                        {pet.healthStatus?.neutered && (
                                            <Badge variant="info" dot>Neutered / Spayed</Badge>
                                        )}
                                        {pet.healthStatus?.dewormed && (
                                            <Badge variant="success" dot>Dewormed</Badge>
                                        )}
                                    </div>
                                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                        {pet.healthStatus.notes}
                                    </p>
                                </Card>
                            </motion.div>
                        )}

                        {/* Tags */}
                        {pet.tags && pet.tags.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.35 }}
                            >
                                <Card className="p-6">
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                                        <FiTag className="w-5 h-5 text-secondary-500" />
                                        Tags
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {pet.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                to={`${ROUTES.BROWSE_PETS}?search=${encodeURIComponent(tag)}`}
                                                className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                            >
                                                {tag}
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Info */}
                        {pet.owner && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <Card className="p-6">
                                    <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                                        Listed By
                                    </h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <UserAvatar
                                            src={pet.owner.avatar?.url}
                                            name={pet.owner.name}
                                            size="lg"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                {pet.owner.name}
                                            </p>
                                            {pet.owner.location?.city && (
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                                    <FiMapPin className="w-3 h-3" />
                                                    {pet.owner.location.city}, {pet.owner.location.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        as={Link}
                                        to={ROUTES.PROFILE(pet.owner._id)}
                                        variant="outline"
                                        className="w-full"
                                        size="sm"
                                    >
                                        View Profile
                                    </Button>
                                </Card>
                            </motion.div>
                        )}

                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <PetContactCard
                                pet={pet}
                                owner={pet?.owner}
                                contactInfo={pet?.contactInfo}
                                listingType={pet?.listingType}
                                petName={pet?.name}
                            />
                        </motion.div>

                        {/* Listing Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                                    Listing Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Posted</span>
                                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                            {formatRelativeTime(pet.createdAt)}
                                        </span>
                                    </div>
                                    {pet.updatedAt && pet.updatedAt !== pet.createdAt && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-500 dark:text-neutral-400">Updated</span>
                                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                                {formatRelativeTime(pet.updatedAt)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">Status</span>
                                        <Badge
                                            variant={pet.isActive ? 'success' : 'neutral'}
                                            size="sm"
                                            dot
                                        >
                                            {pet.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 dark:text-neutral-400">ID</span>
                                        <span className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">
                                            {pet._id}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Safety Notice */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <Card className="p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-3">
                                    <FiShield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                            Safety Tips
                                        </h3>
                                        <ul className="mt-2 space-y-1.5 text-xs text-amber-700 dark:text-amber-300">
                                            <li>• Always meet in a safe, public place</li>
                                            <li>• Verify the pet's health records before adopting</li>
                                            <li>• Never send money before seeing the pet</li>
                                            <li>• Report suspicious listings immediately</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailPage;