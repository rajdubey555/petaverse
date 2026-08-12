import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import cn from '../../utils/cn';

/**
 * Card — Reusable card component following the PetVerse Design System §10.
 *
 * Variants: default | glass | feature | dashboard | profile
 *
 * Props:
 * - variant: 'default' | 'glass' | 'feature' | 'dashboard' | 'profile' (default: 'default')
 * - padding: 'none' | 'sm' | 'md' | 'lg' (default: 'md' — p-6)
 * - hover: 'lift' | 'scale' | 'glow' | 'none' (default: 'lift')
 * - isClickable: Adds cursor-pointer + enhanced hover
 * - to: React Router link path (wraps card in Link)
 * - onClick: Click handler
 * - className: Additional classes
 * - children: Card content
 */

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

const hoverMap = {
    lift: 'hover:-translate-y-1 hover:shadow-soft',
    scale: 'hover:scale-[1.02] hover:shadow-soft',
    glow: 'hover:shadow-soft-lg',
    none: '',
};

const Card = ({
    variant = 'default',
    padding = 'md',
    hover = 'lift',
    isClickable = false,
    to,
    onClick,
    className,
    children,
    ...props
}) => {
    const baseClasses = cn(
        'rounded-2xl transition-all duration-200 ease-out',
        paddingMap[padding] || paddingMap.md,
        hoverMap[hover] || hoverMap.lift,
        isClickable && 'cursor-pointer',
        className
    );

    const variantClasses = {
        default: cn(
            'card',
            hover !== 'none' && 'hover:shadow-soft'
        ),
        glass: cn(
            'card-glass',
            hover !== 'none' && 'hover:shadow-soft'
        ),
        feature: cn(
            'card text-center',
            'hover:-translate-y-2 hover:shadow-soft-lg'
        ),
        dashboard: cn(
            'card',
            hover !== 'none' && 'hover:shadow-md'
        ),
        profile: cn(
            'card text-center',
            hover !== 'none' && 'hover:shadow-soft'
        ),
    };

    const cardClasses = cn(
        variantClasses[variant] || variantClasses.default,
        baseClasses
    );

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cardClasses}
            {...props}
        >
            {children}
        </motion.div>
    );

    if (to) {
        return (
            <Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl">
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <div
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick(e);
                    }
                }}
                role="button"
                tabIndex={0}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
            >
                {content}
            </div>
        );
    }

    return content;
};

export default Card;