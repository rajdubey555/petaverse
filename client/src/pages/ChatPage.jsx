import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiMessageCircle,
    FiSend,
    FiClock,
    FiUsers,
    FiHeart,
    FiImage,
    FiBell,
    FiArrowRight,
    FiMail,
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
        icon: FiMessageCircle,
        title: 'Real-Time Messaging',
        description:
            'Chat instantly with pet owners, adopters, and fellow pet lovers. Ask questions, arrange meetups, and build connections.',
        color: 'primary',
    },
    {
        icon: FiImage,
        title: 'Share Photos & Updates',
        description:
            'Send photos of your pets, share updates, and keep the conversation going with rich media sharing.',
        color: 'secondary',
    },
    {
        icon: FiBell,
        title: 'Instant Notifications',
        description:
            'Get notified instantly when someone messages you about a pet listing or replies to your inquiry.',
        color: 'accent',
    },
    {
        icon: FiUsers,
        title: 'Group Conversations',
        description:
            'Create group chats for adoption events, community meetups, or breed-specific discussions.',
        color: 'warning',
    },
];

const howItWorks = [
    {
        step: '01',
        icon: FiHeart,
        title: 'Find a Pet',
        description: 'Browse listings and find the perfect pet you\'re interested in.',
    },
    {
        step: '02',
        icon: FiMessageCircle,
        title: 'Start a Chat',
        description: 'Click "Message" on any listing to start a conversation with the owner.',
    },
    {
        step: '03',
        icon: FiSend,
        title: 'Connect & Meet',
        description: 'Chat, share photos, ask questions, and arrange a safe meetup.',
    },
];

const ChatPage = () => {
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
            <SEO title="Chat | PetVerse" />

            <motion.div className="space-y-16 py-8" initial="initial" animate="animate" variants={stagger}>
                {/* Hero */}
                <motion.section className="text-center max-w-3xl mx-auto" variants={fadeUp}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-500/15 mb-6">
                        <FiMessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Chat With Pet Lovers
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
                        Real-time messaging is coming soon to PetVerse! Connect directly with pet
                        owners, ask questions about listings, and build meaningful relationships
                        within the pet community.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium">
                        <FiClock className="w-4 h-4" />
                        Launching Soon
                    </div>
                </motion.section>

                {/* How It Works */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        How Messaging Will Work
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {howItWorks.map((item) => (
                            <Card key={item.step} className="text-center p-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-500/15 mb-4">
                                    <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="text-xs font-bold text-primary-500 dark:text-primary-400 mb-2">
                                    STEP {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Features */}
                <motion.section variants={fadeUp}>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center mb-8">
                        What To Expect
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {features.map((feature) => (
                            <Card key={feature.title} hover className="p-5">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                                            feature.color === 'primary' && 'bg-primary-100 dark:bg-primary-500/15',
                                            feature.color === 'secondary' && 'bg-secondary-100 dark:bg-secondary-500/15',
                                            feature.color === 'accent' && 'bg-accent-100 dark:bg-accent-500/15',
                                            feature.color === 'warning' && 'bg-amber-100 dark:bg-amber-500/15'
                                        )}
                                    >
                                        <feature.icon
                                            className={cn(
                                                'w-5 h-5',
                                                feature.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                                                feature.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                                                feature.color === 'accent' && 'text-accent-600 dark:text-accent-400',
                                                feature.color === 'warning' && 'text-amber-600 dark:text-amber-400'
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

                {/* Newsletter */}
                <motion.section variants={fadeUp} className="max-w-lg mx-auto">
                    <Card className="text-center p-8">
                        <FiMail className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                        {subscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    You're on the list!
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    We'll notify you as soon as messaging goes live.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Get Notified When Chat Launches
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
                                    Be the first to know when real-time messaging is available on PetVerse.
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
                                        aria-label="Email address for chat launch notification"
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

                {/* Browse CTA */}
                <motion.section className="text-center" variants={fadeUp}>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                        In the meantime, browse available pets and find your new best friend.
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

export default ChatPage;
