import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import LazyImage from '../common/LazyImage';

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

const PetImageCarousel = ({
    images = [],
    alt = 'Pet image',
    aspectRatio = '4/3',
    showThumbnails = true,
    showCounter = true,
    allowFullscreen = true,
    className,
    ...props
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const hasImages = images && images.length > 0;
    const totalImages = hasImages ? images.length : 0;
    const isSingleImage = totalImages === 1;

    const goTo = useCallback(
        (newIndex) => {
            if (totalImages <= 1) return;
            setDirection(newIndex > currentIndex ? 1 : -1);
            setCurrentIndex(((newIndex % totalImages) + totalImages) % totalImages);
        },
        [currentIndex, totalImages]
    );

    const goNext = useCallback(() => {
        if (totalImages <= 1) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, [totalImages]);

    const goPrev = useCallback(() => {
        if (totalImages <= 1) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }, [totalImages]);

    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback(
        (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX.current;
            const deltaY = touchEndY - touchStartY.current;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    goPrev();
                } else {
                    goNext();
                }
            }
        },
        [goNext, goPrev]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goPrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goNext();
            } else if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        },
        [goNext, goPrev, isFullscreen]
    );

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen, handleKeyDown]);

    // Fallback if no images
    if (!hasImages) {
        return (
            <div
                className={cn(
                    'relative bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-sm min-h-[320px]',
                    className
                )}
                style={{ aspectRatio: aspectRatio.replace('/', ' / ') }}
                {...props}
            >
                <div className="text-center p-8">
                    <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        No images available
                    </p>
                </div>
            </div>
        );
    }

    const currentImgUrl = images[currentIndex]?.url;

    const carouselContent = (
        <div
            ref={carouselRef}
            className={cn(
                'relative bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 group/carousel h-[360px] sm:h-[420px] md:h-[480px] w-full',
                className
            )}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            {...props}
        >
            {/* Blurred ambient background image for portrait images */}
            {currentImgUrl && (
                <div 
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-500"
                    style={{ backgroundImage: `url(${currentImgUrl})` }}
                />
            )}

            {/* Main Image Container */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 flex items-center justify-center p-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(_, { offset, velocity }) => {
                        setIsDragging(false);
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            goNext();
                        } else if (swipe > swipeConfidenceThreshold) {
                            goPrev();
                        }
                    }}
                >
                    <LazyImage
                        src={currentImgUrl}
                        alt={`${alt} - Image ${currentIndex + 1} of ${totalImages}`}
                        className="w-full h-full object-cover transition-transform duration-300"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay for Controls */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Navigation Arrows */}
            {!isSingleImage && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                        }}
                        className={cn(
                            'absolute left-4 top-1/2 -translate-y-1/2 z-20',
                            'w-10 h-10 rounded-full',
                            'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md',
                            'border border-white/20 dark:border-neutral-700/50',
                            'shadow-lg hover:shadow-xl hover:scale-105',
                            'flex items-center justify-center',
                            'text-neutral-800 dark:text-neutral-100',
                            'hover:bg-white dark:hover:bg-neutral-800',
                            'opacity-90 sm:opacity-0 group-hover/carousel:opacity-100',
                            'transition-all duration-200',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                        )}
                        aria-label="Previous image"
                    >
                        <FiChevronLeft size={22} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                        }}
                        className={cn(
                            'absolute right-4 top-1/2 -translate-y-1/2 z-20',
                            'w-10 h-10 rounded-full',
                            'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md',
                            'border border-white/20 dark:border-neutral-700/50',
                            'shadow-lg hover:shadow-xl hover:scale-105',
                            'flex items-center justify-center',
                            'text-neutral-800 dark:text-neutral-100',
                            'hover:bg-white dark:hover:bg-neutral-800',
                            'opacity-90 sm:opacity-0 group-hover/carousel:opacity-100',
                            'transition-all duration-200',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                        )}
                        aria-label="Next image"
                    >
                        <FiChevronRight size={22} />
                    </button>
                </>
            )}

            {/* Fullscreen Button */}
            {allowFullscreen && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(true);
                    }}
                    className={cn(
                        'absolute top-4 right-4 z-20',
                        'w-9 h-9 rounded-full',
                        'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md',
                        'border border-white/20 dark:border-neutral-700/50',
                        'shadow-lg hover:scale-105',
                        'flex items-center justify-center',
                        'text-neutral-800 dark:text-neutral-100',
                        'hover:bg-white dark:hover:bg-neutral-800',
                        'transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                    )}
                    aria-label="View fullscreen"
                >
                    <FiMaximize size={16} />
                </button>
            )}

            {/* Counter Badge */}
            {showCounter && !isSingleImage && (
                <div className="absolute bottom-4 left-4 z-20 px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white shadow-md">
                    📸 {currentIndex + 1} / {totalImages}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-3">
            {carouselContent}

            {/* Thumbnails */}
            {showThumbnails && !isSingleImage && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {images.map((image, index) => (
                        <button
                            key={image.url || index}
                            onClick={() => goTo(index)}
                            className={cn(
                                'relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-sm',
                                'border-2 transition-all duration-200 transform hover:scale-105',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                index === currentIndex
                                    ? 'border-primary-500 ring-2 ring-primary-500/40 scale-105 opacity-100'
                                    : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 opacity-60 hover:opacity-100'
                            )}
                            aria-label={`View image ${index + 1}`}
                            aria-current={index === currentIndex ? 'true' : undefined}
                        >
                            <LazyImage
                                src={image.url}
                                alt={`${alt} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform hover:scale-110"
                            aria-label="Close fullscreen"
                        >
                            <FiX size={24} />
                        </button>

                        {/* Counter */}
                        {showCounter && !isSingleImage && (
                            <div className="absolute top-5 left-5 z-20 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm text-white font-medium border border-white/10">
                                {currentIndex + 1} / {totalImages}
                            </div>
                        )}

                        {/* Fullscreen Image */}
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                className="absolute inset-0 flex items-center justify-center p-4 md:p-12"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(_, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        goNext();
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        goPrev();
                                    }
                                }}
                            >
                                <img
                                    src={images[currentIndex]?.url}
                                    alt={`${alt} - Image ${currentIndex + 1} of ${totalImages}`}
                                    className="max-w-full max-h-full object-contain select-none rounded-xl shadow-2xl"
                                    draggable={false}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Fullscreen Navigation */}
                        {!isSingleImage && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform hover:scale-110"
                                    aria-label="Previous image"
                                >
                                    <FiChevronLeft size={28} />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform hover:scale-110"
                                    aria-label="Next image"
                                >
                                    <FiChevronRight size={28} />
                                </button>

                                {/* Thumbnail Strip */}
                                {showThumbnails && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 max-w-[90vw] overflow-x-auto px-2 py-1 scrollbar-none">
                                        {images.map((image, index) => (
                                            <button
                                                key={image.url || index}
                                                onClick={() => goTo(index)}
                                                className={cn(
                                                    'flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden',
                                                    'border-2 transition-all duration-200',
                                                    index === currentIndex
                                                        ? 'border-white ring-2 ring-white/50 scale-110'
                                                        : 'border-white/20 hover:border-white/60 opacity-50 hover:opacity-100'
                                                )}
                                                aria-label={`View image ${index + 1}`}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${alt} thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(PetImageCarousel);