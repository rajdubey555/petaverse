import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiStar,
    FiMessageSquare,
    FiUsers,
    FiShield,
    FiClock,
    FiArrowRight,
    FiHeart,
    FiMail,
    FiThumbsUp,
} from 'react-icons/fi';
import { ROUTES } from '../config/routes';
import SEO from '../components/common/SEO';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { cn } from '../utils/cn';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const features = [
    {
        icon: FiStar,
        title: 'Pet & Owner Reviews',
        description:
            'Read authentic reviews from adopters and buyers about their experience with pet owners and listings.',
        color: 'amber',
    },
    {
        icon: FiThumbsUp,
        title: 'Verified Reviews',
        description:
            'Only verified adopters and buyers can leave reviews, ensuring authenticity and trustworthiness.',
        color: 'green',
    },
    {
        icon: FiShield,
        title: 'Build Trust',
        description:
            'Reviews help build trust in the community. Good owners get recognized, and everyone benefits from transparency.',
        color: 'primary',
    },
    {
        icon: FiMessageSquare,
        title: 'Detailed Feedback',
        description:
            'Rate communication, pet accuracy, and overall experience. Leave detailed feedback for the community.',
        color: 'accent',
    },
    {
        icon: FiUsers,
        title: 'Community Rated',
        description:
            'See top-rated pet owners and listings. The community helps highlight the best experiences on PetVerse.',
        color: 'secondary',
    },
    {
        icon: FiStar,
        title: '5-Star Rating System',
        description:
            'Simple and intuitive 5-star rating system for all aspects of the adoption or purchase experience.',
        color: 'amber',
    },
];

const testimonials = [
    {
        name: 'Priya S.',
        role: 'Adopted a Golden Retriever',
        quote:
            'The review system will be so helpful! I wish I could have read reviews before adopting. Knowing other people\'s experiences would have made me even more confident.',
        rating: 5,
    },
    {
        name: 'Rahul M.',
        role: 'Pet Owner',
        quote:
            'As a responsible breeder, I can\'t wait for reviews to go live. It will help serious pet parents find me and trust the quality of care I provide to my pets.',
        rating: 5,
    },
    {
        name: 'Ananya K.',
        role: 'Adopted a Persian Cat',
        quote:
            'Reviews and ratings would have saved me so much time. Being able to see which owners are trustworthy and which pets are accurately described is a game-changer.',
        rating: 5,
    },
];

const StarRating = ({ rating, maxStars = 5 }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => (
            <FiStar
                key={i}
                className={cn(
                    'w-4 h-4',
                    i < rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-neutral-300 dark:text-neutral-600'
                )}
            />
        ))}
    </div>
);

const ReviewsPage = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setSubscribed(true);
        setEmail('');
    };

    return (
        <>
            <SEO title="Reviews | PetVerse" />

            <motion.div className="space-y-16 py-8" initial="initial" animate="animate" variants={stagger}>
                {/* Hero */}
                <motion.section className="text-center max-w-3xl mx-auto" variants={fadeUp}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/15 mb-6">
                        <FiStar className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Reviews & Ratings
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
                        A trusted review system is coming to PetVerse. Read authentic reviews from
                        verified adopters and buyers, and make informed decisions about your next pet.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium">
                        <FiClock className="w-4 h-4" />
                        Launching Soon
                    </div>
                </motion.section>

                {/* Features Grid */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        Why Reviews Matter
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {features.map((feature) => (
                            <Card key={feature.title} hover className="p-5">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                                            feature.color === 'primary' && 'bg-primary-100 dark:bg-primary-500/15',
                                            feature.color === 'secondary' && 'bg-secondary-100 dark:bg-secondary-500/15',
                                            feature.color === 'accent' && 'bg-accent-100 dark:bg-accent-500/15',
                                            feature.color === 'amber' && 'bg-amber-100 dark:bg-amber-500/15',
                                            feature.color === 'green' && 'bg-green-100 dark:bg-green-500/15'
                                        )}
                                    >
                                        <feature.icon
                                            className={cn(
                                                'w-5 h-5',
                                                feature.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                                                feature.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                                                feature.color === 'accent' && 'text-accent-600 dark:text-accent-400',
                                                feature.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                                                feature.color === 'green' && 'text-green-600 dark:text-green-400'
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Community Voices */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        What the Community Says
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {testimonials.map((t) => (
                            <Card key={t.name} className="p-5 flex flex-col">
                                <StarRating rating={t.rating} />
                                <blockquote className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 flex-1 italic">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700/50">
                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {t.role}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Newsletter */}
                <motion.section variants={fadeUp} className="max-w-lg mx-auto">
                    <Card className="text-center p-8">
                        <FiMail className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    You're on the list!
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    We'll notify you when reviews and ratings go live.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Get Early Access
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                                    Sign up to be among the first to try the review system when it
                                    launches on PetVerse.
                                </p>
                                <form onSubmit={handleSubscribe} className="space-y-3">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="your@email.com"
                                        leftIcon={FiMail}
                                        error={error}
                                        aria-label="Email address for reviews early access"
                                    />
                                    <Button type="submit" variant="primary" className="w-full">
                                        <FiStar className="w-4 h-4 mr-2" />
                                        Notify Me
                                    </Button>
                                </form>
                            </>
                        )}
                    </Card>
                </motion.section>

                {/* CTA */}
                <motion.section className="text-center" variants={fadeUp}>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        While reviews are being built, explore available pets and find your perfect companion.
                    </p>
                    <Link to={ROUTES.BROWSE_PETS} className="btn btn-primary">
                        <FiHeart className="w-4 h-4 mr-2" />
                        Browse Pets
                        <FiArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </motion.section>
            </motion.div>
        </>
    );
};

export default ReviewsPage;
