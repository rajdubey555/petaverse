import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiUsers,
    FiHeart,
    FiMessageSquare,
    FiCamera,
    FiCalendar,
    FiMapPin,
    FiClock,
    FiArrowRight,
    FiMail,
    FiShare2,
    FiAward,
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
        icon: FiMessageSquare,
        title: 'Discussion Forums',
        description:
            'Join breed-specific discussions, share tips on pet care, training, nutrition, and health with experienced pet owners.',
        color: 'primary',
    },
    {
        icon: FiCamera,
        title: 'Photo Sharing',
        description:
            'Share adorable photos of your pets, participate in photo contests, and showcase your furry friends to the community.',
        color: 'secondary',
    },
    {
        icon: FiCalendar,
        title: 'Events & Meetups',
        description:
            'Discover adoption drives, vaccination camps, pet shows, and community meetups happening near you.',
        color: 'accent',
    },
    {
        icon: FiShare2,
        title: 'Stories & Experiences',
        description:
            'Read and share heartwarming adoption stories, rescue experiences, and life lessons learned from pets.',
        color: 'warning',
    },
    {
        icon: FiAward,
        title: 'Expert Advice',
        description:
            'Connect with veterinarians, trainers, and experienced pet owners for trusted advice on pet care.',
        color: 'info',
    },
    {
        icon: FiMapPin,
        title: 'Local Communities',
        description:
            'Find and connect with pet lovers in your city or neighborhood for walks, playdates, and pet sitting.',
        color: 'red',
    },
];

const upcomingEvents = [
    {
        title: 'Annual Pet Adoption Drive',
        date: 'Coming Soon',
        location: 'Various Cities',
        description: 'Connect with shelters and rescue organizations to find your perfect companion.',
    },
    {
        title: 'Pet Health & Wellness Webinar',
        date: 'Coming Soon',
        location: 'Online',
        description: 'Learn from veterinary experts about preventive care, nutrition, and common health issues.',
    },
    {
        title: 'Community Pet Photo Contest',
        date: 'Coming Soon',
        location: 'Online',
        description: 'Submit your best pet photos and win exciting prizes. Categories for all species.',
    },
];

const CommunityPage = () => {
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
            <SEO title="Community | PetVerse" />

            <motion.div className="space-y-16 py-8" initial="initial" animate="animate" variants={stagger}>
                {/* Hero */}
                <motion.section className="text-center max-w-3xl mx-auto" variants={fadeUp}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-500/15 mb-6">
                        <FiUsers className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Join the PetVerse Community
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
                        A vibrant community for pet lovers is coming soon! Connect with fellow pet
                        owners, share stories, get advice, and participate in exciting events.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium">
                        <FiClock className="w-4 h-4" />
                        Launching Soon
                    </div>
                </motion.section>

                {/* Features Grid */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        What the Community Offers
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
                                            feature.color === 'warning' && 'bg-amber-100 dark:bg-amber-500/15',
                                            feature.color === 'info' && 'bg-sky-100 dark:bg-sky-500/15',
                                            feature.color === 'red' && 'bg-red-100 dark:bg-red-500/15'
                                        )}
                                    >
                                        <feature.icon
                                            className={cn(
                                                'w-5 h-5',
                                                feature.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                                                feature.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                                                feature.color === 'accent' && 'text-accent-600 dark:text-accent-400',
                                                feature.color === 'warning' && 'text-amber-600 dark:text-amber-400',
                                                feature.color === 'info' && 'text-sky-600 dark:text-sky-400',
                                                feature.color === 'red' && 'text-red-600 dark:text-red-400'
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

                {/* Upcoming Events */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        Upcoming Community Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {upcomingEvents.map((event) => (
                            <Card key={event.title} className="p-5 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiCalendar className="w-4 h-4 text-accent-500" />
                                    <span className="text-xs font-medium text-accent-600 dark:text-accent-400">
                                        {event.date}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 flex-1">
                                    {event.description}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                                    <FiMapPin className="w-3.5 h-3.5" />
                                    {event.location}
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Newsletter */}
                <motion.section variants={fadeUp} className="max-w-lg mx-auto">
                    <Card className="text-center p-8">
                        <FiMail className="w-10 h-10 text-secondary-500 mx-auto mb-4" />
                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Welcome to the community!
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    We'll keep you updated on community events and launch news.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Join the Waitlist
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                                    Be the first to join the PetVerse community when it launches. Get
                                    early access to forums, events, and more.
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
                                        aria-label="Email address for community waitlist"
                                    />
                                    <Button type="submit" variant="primary" className="w-full">
                                        <FiUsers className="w-4 h-4 mr-2" />
                                        Join Waitlist
                                    </Button>
                                </form>
                            </>
                        )}
                    </Card>
                </motion.section>

                {/* CTA */}
                <motion.section className="text-center" variants={fadeUp}>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        While you wait, browse available pets and start your journey.
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

export default CommunityPage;
