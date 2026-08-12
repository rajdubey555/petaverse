import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiMessageCircle,
    FiClock,
    FiHelpCircle,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowRight,
} from 'react-icons/fi';
import { Button, Input, Card } from '../components/common';
import { ROUTES } from '../config/routes';
import { cn } from '../utils/cn';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5 },
};

const contactInfo = [
    {
        icon: FiMail,
        title: 'Email Us',
        details: ['support@petverse.com', 'info@petverse.com'],
        description: 'We typically respond within 24 hours',
        color: 'text-primary-600 dark:text-primary-400',
        bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
        icon: FiPhone,
        title: 'Call Us',
        details: ['+91 1800-123-PETS', '+91 98765-43210'],
        description: 'Mon-Fri, 9:00 AM - 6:00 PM IST',
        color: 'text-secondary-600 dark:text-secondary-400',
        bgColor: 'bg-secondary-100 dark:bg-secondary-900/30',
    },
    {
        icon: FiMapPin,
        title: 'Visit Us',
        details: ['123 PetVerse HQ', 'MG Road, Bangalore', 'Karnataka - 560001'],
        description: 'By appointment only',
        color: 'text-accent-600 dark:text-accent-400',
        bgColor: 'bg-accent-100 dark:bg-accent-900/30',
    },
];

const faqs = [
    {
        question: 'How do I create a pet listing?',
        answer: 'Sign up for a free account, click on "Create Listing" in your dashboard, fill in the pet details, upload photos, and submit. Your listing will be reviewed and published within 24 hours.',
    },
    {
        question: 'Is PetVerse free to use?',
        answer: 'Yes! PetVerse is completely free for basic use. You can browse listings, save favorites, and contact pet owners at no cost. We may offer premium features for enhanced visibility in the future.',
    },
    {
        question: 'How do I report a suspicious listing?',
        answer: 'Every listing has a "Report" button. Click it, select a reason, and provide any additional details. Our moderation team will review the report within 24 hours and take appropriate action.',
    },
    {
        question: 'How long does it take to verify a listing?',
        answer: 'Most listings are reviewed within 24 hours. During peak times, it may take up to 48 hours. You will receive a notification once your listing is approved.',
    },
    {
        question: 'Can I edit or delete my listing?',
        answer: 'Yes, you can edit or delete your listings from your dashboard at any time. Go to "My Listings" and use the edit or delete options for each pet.',
    },
    {
        question: 'How do I contact a pet owner?',
        answer: 'On each pet detail page, you will find the owner\'s contact information (if they have chosen to share it). You can also use our in-platform messaging feature to connect securely.',
    },
    {
        question: 'What should I do if I lost my pet?',
        answer: 'Immediately create a "Lost & Found" listing with your pet\'s photo, description, last known location, and your contact details. Also check the "Lost & Found" section for any found pets matching your description.',
    },
    {
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account and select "Deactivate Account". This will permanently remove your profile, listings, and all associated data. This action cannot be undone.',
    },
];

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setErrors({ submit: 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <motion.div
                        className="text-center max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="mt-4 text-lg text-white/80">
                            Have questions, feedback, or need help? We're here for you. Reach out and we'll get back to you as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="relative -mt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                            >
                                <Card className="p-6 text-center h-full">
                                    <div className={cn('inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4', info.bgColor)}>
                                        <info.icon className={cn('w-7 h-7', info.color)} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                        {info.title}
                                    </h3>
                                    {info.details.map((detail, j) => (
                                        <p key={j} className="text-neutral-600 dark:text-neutral-300 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                    <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                                        {info.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & FAQ */}
            <section className="py-8 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <motion.div {...fadeUp}>
                            <Card className="p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Send Us a Message
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>

                                {submitted ? (
                                    <motion.div
                                        className="text-center py-8"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                            <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                            Message Sent!
                                        </h3>
                                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                                            Thank you for reaching out. We'll get back to you shortly.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSubmitted(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <Input
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                error={errors.name}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                error={errors.email}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="What is this about?"
                                                error={errors.subject}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                                Message <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Tell us how we can help..."
                                                className={cn(
                                                    'w-full rounded-xl border bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none',
                                                    errors.message
                                                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                                                        : 'border-neutral-300 dark:border-neutral-600'
                                                )}
                                            />
                                            {errors.message && (
                                                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                                            )}
                                        </div>
                                        {errors.submit && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                                                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {errors.submit}
                                            </div>
                                        )}
                                        <Button
                                            type="submit"
                                            className="w-full rounded-xl"
                                            disabled={isSubmitting}
                                            isLoading={isSubmitting}
                                            icon={<FiSend className="w-4 h-4" />}
                                        >
                                            Send Message
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                    Quick answers to common questions about PetVerse.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {faqs.map((faq, i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 text-left"
                                        >
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 pr-4">
                                                {faq.question}
                                            </span>
                                            <FiHelpCircle
                                                className={cn(
                                                    'w-5 h-5 flex-shrink-0 transition-colors',
                                                    openFaq === i
                                                        ? 'text-primary-500'
                                                        : 'text-neutral-400 dark:text-neutral-500'
                                                )}
                                            />
                                        </button>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;