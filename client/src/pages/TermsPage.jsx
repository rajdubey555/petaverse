import { motion } from 'framer-motion';
import {
    FiFileText,
    FiUserCheck,
    FiAlertCircle,
    FiShield,
    FiEdit3,
    FiTrash2,
    FiFlag,
    FiLock,
    FiGlobe,
    FiMail,
    FiCheckCircle,
} from 'react-icons/fi';
import { Card } from '../components/common';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5 },
};

const termsSections = [
    {
        icon: FiUserCheck,
        title: '1. Acceptance of Terms',
        content: `By accessing or using PetVerse ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.

These Terms constitute a legally binding agreement between you ("User", "you", or "your") and PetVerse ("we", "us", or "our"). Your use of the Platform is also governed by our Privacy Policy, which is incorporated by reference into these Terms.`,
    },
    {
        icon: FiGlobe,
        title: '2. Eligibility',
        content: `To use PetVerse, you must:
• Be at least 18 years of age, or have the consent of a parent or legal guardian.
• Provide accurate, current, and complete information during registration.
• Maintain and promptly update your account information.
• Be capable of entering into a legally binding agreement.
• Not have been previously suspended or removed from the Platform.

We reserve the right to refuse service to anyone for any reason at any time.`,
    },
    {
        icon: FiCheckCircle,
        title: '3. User Accounts',
        content: `• You are responsible for maintaining the confidentiality of your account credentials.
• You are responsible for all activities that occur under your account.
• You must notify us immediately of any unauthorized use of your account.
• You may not use another user's account without permission.
• We reserve the right to suspend or terminate accounts that violate these Terms.
• You may delete your account at any time through the Settings page.

Account security is your responsibility. We implement security measures but cannot guarantee absolute protection against unauthorized access.`,
    },
    {
        icon: FiEdit3,
        title: '4. Pet Listings',
        content: `When creating a pet listing on PetVerse, you agree that:
• All information provided is accurate, truthful, and complete.
• You have the legal right to list the pet (you are the owner or authorized representative).
• Photos are genuine and accurately represent the pet.
• You will not list pets for illegal purposes or engage in animal trafficking.
• You will comply with all applicable local, state, and national laws regarding pet sales and adoption.
• We reserve the right to remove any listing that violates these Terms without prior notice.
• Listings are reviewed by our moderation team and may take up to 24 hours to be approved.`,
    },
    {
        icon: FiAlertCircle,
        title: '5. Prohibited Activities',
        content: `You agree NOT to:
• Post false, misleading, or fraudulent information.
• List animals obtained through illegal means.
• Engage in animal cruelty, trafficking, or fighting.
• Harass, threaten, or abuse other users.
• Use the Platform for any illegal purpose.
• Upload malicious code, viruses, or harmful content.
• Attempt to gain unauthorized access to other users' accounts.
• Scrape, data mine, or use automated tools to extract data from the Platform.
• Impersonate any person or entity.
• Interfere with the proper functioning of the Platform.

Violation of these prohibitions may result in immediate account suspension or termination and may be reported to law enforcement authorities.`,
    },
    {
        icon: FiShield,
        title: '6. Intellectual Property',
        content: `• All content on PetVerse, including text, graphics, logos, icons, images, and software, is the property of PetVerse or its content suppliers.
• The PetVerse name, logo, and branding are trademarks of PetVerse.
• You retain ownership of the content you post (listings, photos, messages), but grant us a worldwide, non-exclusive, royalty-free license to display and distribute your content on the Platform.
• You may not use our trademarks, logos, or branding without prior written permission.
• If you believe your intellectual property rights have been violated, contact us at legal@petverse.com.`,
    },
    {
        icon: FiFlag,
        title: '7. Reporting and Moderation',
        content: `• Users can report listings, messages, or other content that violates these Terms using the "Report" feature.
• Our moderation team reviews all reports within 24 hours.
• We may remove content, suspend accounts, or take other actions based on our investigation.
• We are not obligated to monitor all content but reserve the right to do so.
• Decisions made by our moderation team are final and binding.

If you disagree with a moderation decision, you may appeal by contacting support@petverse.com.`,
    },
    {
        icon: FiLock,
        title: '8. Limitation of Liability',
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:
• PetVerse is provided "as is" and "as available" without warranties of any kind.
• We do not guarantee the accuracy, completeness, or reliability of any listing.
• We are not responsible for any transactions or interactions between users.
• We are not liable for any indirect, incidental, special, consequential, or punitive damages.
• Our total liability for any claim shall not exceed the amount you paid us (if any) in the 12 months preceding the claim.
• We are not responsible for the health, behavior, or condition of any pet listed on our Platform.

You acknowledge that pet adoption and purchase involves inherent risks, and you assume full responsibility for your decisions.`,
    },
    {
        icon: FiTrash2,
        title: '9. Termination',
        content: `• You may terminate your account at any time through the Settings page.
• We may suspend or terminate your account at any time for violation of these Terms.
• Upon termination, your right to use the Platform ceases immediately.
• We may retain certain information as required by law or for legitimate business purposes.
• Provisions relating to intellectual property, limitation of liability, and indemnification survive termination.

If your account is terminated by us, you may not create a new account without our explicit permission.`,
    },
    {
        icon: FiMail,
        title: '10. Contact Information',
        content: `For questions about these Terms of Service, please contact us:

Email: legal@petverse.com
Support: support@petverse.com
Website: https://petverse.com/contact

We will respond to inquiries within 2-3 business days.`,
    },
];

const TermsPage = () => {
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
                            <FiFileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Terms of Service
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
                                Welcome to PetVerse. These Terms of Service govern your use of our platform, including all
                                features, services, and content provided through PetVerse. By using our platform, you agree
                                to comply with and be bound by these Terms.
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mt-4">
                                Please read these Terms carefully before using PetVerse. If you do not agree with any part
                                of these Terms, you must discontinue use of the Platform immediately.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Terms Sections */}
            <section className="pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {termsSections.map((section, i) => (
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

                    {/* Acknowledgment */}
                    <motion.div className="mt-8" {...fadeUp}>
                        <Card className="p-6 sm:p-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-4">
                                <FiCheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                        Acknowledgment
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                        By using PetVerse, you acknowledge that you have read, understood, and agree to be bound
                                        by these Terms of Service. If you have any questions, please contact us at{' '}
                                        <a href="mailto:legal@petverse.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                                            legal@petverse.com
                                        </a>
                                        .
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

export default TermsPage;