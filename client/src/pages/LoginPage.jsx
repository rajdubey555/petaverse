import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiShield,
  FiUsers,
  FiHeart,
  FiAlertCircle,
  FiMail,
  FiLock,
  FiLogIn,
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

const benefits = [
  {
    icon: FiHeart,
    title: 'Find Your Perfect Pet',
    description: 'Browse thousands of pets looking for loving homes across India.',
  },
  {
    icon: FiHeart,
    title: 'Save Favorites',
    description: 'Save pets you love and come back to them anytime.',
  },
  {
    icon: FiUsers,
    title: 'Join Our Community',
    description: 'Connect with pet owners, breeders, and fellow animal lovers.',
  },
  {
    icon: FiShield,
    title: 'Safe & Secure',
    description: 'Verified listings and secure communication for your peace of mind.',
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithEmail, isLoginLoading, isEmailLoginLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await loginWithEmail({
        email: formData.email,
        password: formData.password,
      });
      const userRole = result?.data?.user?.role;
      if (userRole === 'admin') {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          'Invalid email or password. Please try again.'
      );
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError(null);
    try {
      const result = await login(credential);
      const userRole = result?.data?.user?.role;
      if (userRole === 'admin') {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          'Google login failed. Please try again.'
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
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Branding & Benefits */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="hidden lg:block"
          >
            <motion.div variants={fadeUp} className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <FiHeart className="w-4 h-4" />
                Welcome to PetVerse
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Your Gateway to the{' '}
                <span className="text-primary-600 dark:text-primary-400">
                  Pet World
                </span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg">
                Sign in to PetVerse and discover a world of adorable pets waiting
                for their forever homes. Your perfect companion is just a click
                away.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 gap-5"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Login Form */}
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
                  Welcome Back
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Sign in with your email address or Google account
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

              {/* Email / Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    leftIcon={FiMail}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Password
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

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isEmailLoginLoading}
                  className="rounded-xl mt-2"
                >
                  <FiLogIn className="w-4 h-4 mr-2" />
                  Sign In with Email
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

              {/* Google Login Button */}
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
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;