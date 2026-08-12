import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiUserCheck, FiDatabase, FiMail } from 'react-icons/fi';
import { Card } from '../components/common';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5 },
};

const policySections = [
    {
        icon: FiDatabase,
        title: 'Information We Collect',
        content: `We collect information that you provide directly to us, including:
• Account information: Name, email address, and profile picture when you create an account via Google OAuth.
• Profile information: Bio, phone number, location, and other details you choose to add to your profile.
• Pet listings: Photos, descriptions, health records, and other information about pets you list.
• Communication data: Messages sent through our platform and communications with our support team.
• Usage data: Information about how you interact with our platform, including pages visited, listings viewed, and features used.`,
    },
    {
        icon: FiEye,
        title: 'How We Use Your Information',
        content: `We use the information we collect to:
• Provide, maintain, and improve our platform and services.
• Display your pet listings and profile information to other users as per your privacy settings.
• Facilitate communication between pet owners and interested adopters/buyers.
• Send you notifications about your listings, saved pets, and platform updates.
• Detect, investigate, and prevent fraudulent or unauthorized activity.
• Comply with legal obligations and enforce our Terms of Service.`,
    },
    {
        icon: FiUserCheck,
        title: 'Information Sharing',
        content: `We do not sell your personal information to third parties. We may share your information:
• With other users: When you create a listing or profile, the information you choose to make public is visible to other users.
• With service providers: Third-party vendors who help us operate our platform (e.g., cloud hosting, image storage via Cloudinary).
• For legal reasons: If required by law, court order, or to protect the rights, property, or safety of PetVerse, our users, or others.
• With your consent: We may share your information for any other purpose with your explicit consent.`,
    },
    {
        icon: FiLock,
        title: 'Data Security',
        content: `We implement industry-standard security measures to protect your personal information:
• All data is transmitted over HTTPS using TLS encryption.
• Passwords are hashed and never stored in plain text.
• Authentication tokens are securely stored and have expiration times.
• We use HTTP-only cookies for refresh tokens to prevent XSS attacks.
• Access to personal data is restricted to authorized personnel only.
• Regular security audits and vulnerability assessments are conducted.
However, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security of your data.`,
    },
    {
        icon: FiShield,
        title: 'Data Retention',
        content: `We retain your personal information for as long as your account is active or as needed to provide you services.
• Account data: Retained until you delete your account.
• Pet listings: Retained until you delete them or your account is deactivated.
• Communication logs: Retained for a reasonable period for customer service and legal purposes.
• Usage data: May be retained in anonymized form indefinitely for analytics purposes.
You can request deletion of your data at any time by contacting us or using the account deactivation feature in Settings.`,
    },
    {
        icon: FiMail,
        title: 'Your Rights',
        content: `You have the following rights regarding your personal data:
• Access: You can request a copy of your personal data we hold.
• Correction: You can update your profile information at any time through your account settings.
• Deletion: You can delete your account and associated data through the Settings page.
• Privacy Settings: You can control what information is visible to other users through your privacy settings.
• Opt-out: You can opt out of non-essential communications through your notification preferences.
• Portability: You can request your data in a portable format.
To exercise these rights, contact us at privacy@petverse.com.`,
    },
];

const PrivacyPage = () => {
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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
                            <FiShield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="mt-4 text-lg text-white/80">
                            Last updated: January 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp}>
                        <Card className="p-6 sm:p-8">
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                At PetVerse, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                                disclose, and safeguard your information when you use our platform. Please read this policy
                                carefully to understand our practices regarding your personal data.
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mt-4">
                                By using PetVerse, you agree to the collection and use of information in accordance with this
                                policy. If you do not agree with any part of this policy, please do not use our platform.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Policy Sections */}
            <section className="pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {policySections.map((section, i) => (
                            <motion.div
                                key={section.title}
                                {...fadeUp}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                            >
                                <Card className="p-6 sm:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                                {section.title}
                                            </h2>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                                {section.content}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact */}
                    <motion.div className="mt-8" {...fadeUp}>
                        <Card className="p-6 sm:p-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-4">
                                <FiMail className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                        Questions About Our Privacy Policy?
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                        If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
                                        <a href="mailto:privacy@petverse.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                                            privacy@petverse.com
                                        </a>
                                        . We are committed to protecting your privacy and will respond to your inquiries promptly.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPage;