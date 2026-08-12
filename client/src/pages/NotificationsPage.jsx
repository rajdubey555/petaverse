import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiBell,
    FiHeart,
    FiMessageCircle,
    FiStar,
    FiClock,
    FiAlertCircle,
    FiCheckCircle,
    FiArrowRight,
    FiMail,
} from 'react-icons/fi';
import { ROUTES } from '../config/routes';
import SEO from '../components/common/SEO';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
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

const notificationTypes = [
    {
        icon: FiHeart,
        title: 'Saved Pet Updates',
        description: 'Get notified when a saved pet\'s status changes, price drops, or gets adopted.',
        color: 'red',
        badge: 'Coming Soon',
    },
    {
        icon: FiMessageCircle,
        title: 'New Messages',
        description: 'Never miss a message from pet owners or adopters interested in your listings.',
        color: 'primary',
        badge: 'Coming Soon',
    },
    {
        icon: FiStar,
        title: 'Featured Listings',
        description: 'Be the first to know about new featured pets and special adoption opportunities.',
        color: 'amber',
        badge: 'Coming Soon',
    },
    {
        icon: FiAlertCircle,
        title: 'Listing Alerts',
        description: 'Get alerts when your listing receives views, saves, or inquiries from interested people.',
        color: 'accent',
        badge: 'Coming Soon',
    },
    {
        icon: FiCheckCircle,
        title: 'Application Updates',
        description: 'Track adoption application status updates and receive timely notifications.',
        color: 'green',
        badge: 'Coming Soon',
    },
    {
        icon: FiHeart,
        title: 'New Matches',
        description: 'Discover when new pets matching your preferences are listed on PetVerse.',
        color: 'secondary',
        badge: 'Coming Soon',
    },
];

const NotificationsPage = () => {
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
            <SEO title="Notifications | PetVerse" />

            <motion.div className="space-y-16 py-8" initial="initial" animate="animate" variants={stagger}>
                {/* Hero */}
                <motion.section className="text-center max-w-3xl mx-auto" variants={fadeUp}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-100 dark:bg-accent-500/15 mb-6">
                        <FiBell className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Stay in the Loop
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
                        Smart notifications are coming to PetVerse. Stay updated on your listings,
                        saved pets, messages, and everything happening in your pet community.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium">
                        <FiClock className="w-4 h-4" />
                        Launching Soon
                    </div>
                </motion.section>

                {/* Notification Types */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        What You'll Be Notified About
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {notificationTypes.map((item) => (
                            <Card key={item.title} hover className="p-5">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                                            item.color === 'primary' && 'bg-primary-100 dark:bg-primary-500/15',
                                            item.color === 'secondary' && 'bg-secondary-100 dark:bg-secondary-500/15',
                                            item.color === 'accent' && 'bg-accent-100 dark:bg-accent-500/15',
                                            item.color === 'red' && 'bg-red-100 dark:bg-red-500/15',
                                            item.color === 'amber' && 'bg-amber-100 dark:bg-amber-500/15',
                                            item.color === 'green' && 'bg-green-100 dark:bg-green-500/15'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                'w-5 h-5',
                                                item.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                                                item.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                                                item.color === 'accent' && 'text-accent-600 dark:text-accent-400',
                                                item.color === 'red' && 'text-red-600 dark:text-red-400',
                                                item.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                                                item.color === 'green' && 'text-green-600 dark:text-green-400'
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                                {item.title}
                                            </h3>
                                            <Badge variant="warning" size="xs">
                                                {item.badge}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Newsletter */}
                <motion.section variants={fadeUp} className="max-w-lg mx-auto">
                    <Card className="text-center p-8">
                        <FiMail className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    You're subscribed!
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    We'll let you know when notifications go live.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Get Early Access
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                                    Sign up to be notified when smart notifications launch on PetVerse.
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
                                        aria-label="Email address for notifications early access"
                                    />
                                    <Button type="submit" variant="primary" className="w-full">
                                        <FiBell className="w-4 h-4 mr-2" />
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
                        Explore listings while you wait for notifications to go live.
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

export default NotificationsPage;
