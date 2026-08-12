import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiCheckCircle,
    FiHeart,
    FiSearch,
    FiMessageCircle,
    FiAlertCircle,
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiMapPin,
    FiUserPlus,
} from 'react-icons/fi';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
    {
        icon: FiSearch,
        title: 'Browse Pets',
        description: 'Explore thousands of pets across India with advanced filters.',
        color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
        icon: FiHeart,
        title: 'Save Favorites',
        description: 'Save pets you love and track them in your personal wishlist.',
        color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    },
    {
        icon: FiMessageCircle,
        title: 'Connect & Chat',
        description: 'Message pet owners directly and discuss adoption details.',
        color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
        icon: FiHeart,
        title: 'List Your Pets',
        description: 'Create listings for pets that need new homes with ease.',
        color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
];

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login, registerWithEmail, isLoginLoading, isEmailRegisterLoading } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        city: '',
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please check and try again.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (!formData.phone.trim()) {
            setError('Phone number is required.');
            return;
        }

        if (!formData.city.trim()) {
            setError('City is required.');
            return;
        }

        try {
            await registerWithEmail({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                location: { city: formData.city, state: '', country: 'India' },
            });
            navigate(ROUTES.HOME, { replace: true });
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                'Registration failed. Please try again.'
            );
        }
    };

    const handleGoogleSuccess = async (credential) => {
        setError(null);
        try {
            await login(credential);
            navigate(ROUTES.HOME, { replace: true });
        } catch (err) {
            setError(
                err?.data?.message ||
                err?.message ||
                'Google sign up failed. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link
                            to={ROUTES.HOME}
                            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
                    {/* Left Column - Branding & Features */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="hidden lg:block"
                    >
                        <motion.div variants={fadeUp} className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                                <FiHeart className="w-4 h-4" />
                                Join PetVerse Today
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                                Find Your{' '}
                                <span className="text-primary-600 dark:text-primary-400">
                                    Furry Soulmate
                                </span>
                            </h1>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg">
                                Create your PetVerse account and unlock a world of adorable pets,
                                helpful resources, and a community that shares your love for
                                animals.
                            </p>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeUp}
                                    className="flex gap-3 p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                                >
                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}
                                    >
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-neutral-900 dark:text-white">
                                            {feature.title}
                                        </h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Sign Up Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card
                            padding="lg"
                            className="border-neutral-200 dark:border-neutral-700"
                        >
                            {/* Title */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Create Your Account
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                    Fill in your details or register with Google
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6"
                                >
                                    <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {error}
                                    </p>
                                </motion.div>
                            )}

                            {/* Registration Form */}
                            <form onSubmit={handleEmailRegister} className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        Full Name *
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Rahul Sharma"
                                        leftIcon={FiUser}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                        Email Address *
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="rahul@example.com"
                                        leftIcon={FiMail}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Password *
                                        </label>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            leftIcon={FiLock}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Confirm Password *
                                        </label>
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            leftIcon={FiLock}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            Phone Number *
                                        </label>
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 9876543210"
                                            leftIcon={FiPhone}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                            City *
                                        </label>
                                        <Input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Delhi / Mumbai"
                                            leftIcon={FiMapPin}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    isLoading={isEmailRegisterLoading}
                                    className="rounded-xl mt-2"
                                >
                                    <FiUserPlus className="w-4 h-4 mr-2" />
                                    Create Account
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                    <span className="px-3 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold">
                                        OR
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign Up Button */}
                            <GoogleLoginButton
                                onSuccess={handleGoogleSuccess}
                                onError={(errMessage) => setError(errMessage)}
                                isLoading={isLoginLoading}
                                error={null}
                                fullWidth
                            />
                        </Card>

                        {/* Footer Links */}
                        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
                            Already have an account?{' '}
                            <Link
                                to={ROUTES.LOGIN}
                                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;