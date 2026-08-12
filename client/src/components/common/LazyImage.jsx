import { useState, useRef, useEffect, useMemo } from 'react';
import { FiImage } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * LazyImage — Progressive lazy-loading image component using IntersectionObserver.
 * Ensures WebP compatibility and perfect object-cover alignment across grid cards.
 */

const LazyImage = ({
    src,
    alt,
    placeholderSrc,
    aspectRatio,
    width,
    height,
    className,
    imgClassName,
    rootMargin = '200px',
    threshold = 0.01,
    objectFit = 'cover',
    onLoad,
    onError,
    fallback,
    ...imgProps
}) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    // Format URL for WebP if it's an Unsplash or Cloudinary image
    const formattedSrc = useMemo(() => {
        if (!src || typeof src !== 'string') return src;
        let url = src;
        if (url.includes('unsplash.com')) {
            if (url.includes('fm=')) {
                url = url.replace(/fm=[a-zA-Z0-9]+/, 'fm=webp');
            } else {
                url += (url.includes('?') ? '&' : '?') + 'fm=webp';
            }
        } else if (url.includes('res.cloudinary.com') && !url.includes('f_webp')) {
            url = url.replace('/upload/', '/upload/f_webp,q_auto/');
        }
        return url;
    }, [src]);

    // IntersectionObserver: trigger load when element enters viewport
    useEffect(() => {
        const node = imgRef.current;
        if (!node || isInView) return;

        if (typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observerRef.current?.disconnect();
                }
            },
            { rootMargin, threshold }
        );

        observerRef.current.observe(node);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [isInView, rootMargin, threshold]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const handlePlaceholderLoad = () => {
        setPlaceholderLoaded(true);
    };

    // Calculate aspect ratio padding for CLS prevention if explicitly passed
    const aspectRatioStyle = {};
    if (aspectRatio && !width && !height) {
        const [w, h] = aspectRatio.split('/').map(Number);
        if (w && h) {
            aspectRatioStyle.paddingBottom = `${(h / w) * 100}%`;
        }
    }

    const containerClasses = cn(
        'relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 w-full h-full flex items-center justify-center',
        className
    );

    const imageClasses = cn(
        'w-full h-full object-cover object-center absolute inset-0 transition-all duration-500 ease-out',
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
        imgClassName
    );

    // Error state fallback
    if (hasError && !isLoaded) {
        return (
            <div
                ref={imgRef}
                className={containerClasses}
                style={width && height ? { width, height } : aspectRatioStyle}
            >
                {fallback || (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-800 p-4 text-center">
                        <FiImage className="w-8 h-8 opacity-60" />
                        <span className="text-xs font-medium">
                            {alt || 'Pet image'}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            ref={imgRef}
            className={containerClasses}
            style={width && height ? { width, height } : aspectRatioStyle}
        >
            {/* Low-res placeholder */}
            {placeholderSrc && isInView && !isLoaded && (
                <img
                    src={placeholderSrc}
                    alt=""
                    aria-hidden="true"
                    onLoad={handlePlaceholderLoad}
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500',
                        placeholderLoaded ? 'opacity-100' : 'opacity-0',
                        isLoaded && 'opacity-0'
                    )}
                    style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                />
            )}

            {/* Loading skeleton */}
            {isInView && !isLoaded && !placeholderSrc && (
                <div className="absolute inset-0 skeleton-pulse bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            )}

            {/* Full-res image */}
            {isInView && (
                <img
                    src={formattedSrc}
                    alt={alt || 'Pet'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={imageClasses}
                    style={{ objectFit }}
                    loading="lazy"
                    {...(width && { width })}
                    {...(height && { height })}
                    {...imgProps}
                />
            )}
        </div>
    );
};

export default LazyImage;