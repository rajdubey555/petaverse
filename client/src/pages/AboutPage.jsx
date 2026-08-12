import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiShield,
  FiUsers,
  FiTarget,
  FiAward,
  FiGlobe,
  FiArrowRight,
  FiSmile,
  FiStar,
  FiCheckCircle,
  FiMapPin,
} from 'react-icons/fi';
import { Button, Card } from '../components/common';
import { ROUTES } from '../config/routes';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
};

const values = [
  {
    icon: FiHeart,
    title: 'Compassion',
    description: 'We believe every pet deserves a loving home. Our platform is built on empathy and care for all animals.',
  },
  {
    icon: FiShield,
    title: 'Trust & Safety',
    description: 'Verified listings, secure communication, and a robust reporting system ensure a safe experience for everyone.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    description: 'We bring together pet lovers, owners, adopters, and breeders to create a supportive and responsible community.',
  },
  {
    icon: FiTarget,
    title: 'Transparency',
    description: 'Clear information about each pet, including health records and history, helps you make informed decisions.',
  },
];

const milestones = [
  { year: '2024', title: 'PetVerse Founded', description: 'Launched with a mission to connect pets with loving families across India.' },
  { year: '2024', title: '1,000+ Listings', description: 'Reached our first milestone of 1,000 active pet listings within months of launch.' },
  { year: '2025', title: 'Verified Sellers Program', description: 'Introduced our verification system to ensure quality and trust in every listing.' },
  { year: '2025', title: '50+ Cities', description: 'Expanded to over 50 cities across India, helping pets find homes nationwide.' },
  { year: '2025', title: '10,000+ Happy Families', description: 'Celebrated connecting over 10,000 pets with their forever families.' },
  { year: '2026', title: 'Lost & Found Launch', description: 'Launched dedicated lost & found section to help reunite pets with their families.' },
];

const team = [
  { name: 'PetVerse Team', role: 'Founding Team', description: 'A passionate group of pet lovers, engineers, and designers dedicated to making pet adoption safe and accessible.' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              About PetVerse
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed">
              Our mission is to create a safe, transparent, and compassionate platform where every pet finds a loving home
              and every pet lover finds their perfect companion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-6">
              <FiTarget className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
              At PetVerse, we believe that every pet deserves a loving home and every family deserves the joy of a furry companion.
              Our mission is to bridge the gap between pets in need and caring individuals by providing a trusted, transparent,
              and easy-to-use platform for pet adoption, sale, and breeding.
            </p>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We are committed to promoting responsible pet ownership, supporting ethical breeding practices, and creating
              a community where pet lovers can connect, share, and grow together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Values
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              The principles that guide everything we do at PetVerse
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                {...stagger}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="p-6 h-full text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-5">
                    <value.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Why Choose PetVerse?
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              What makes us India's most trusted pet platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiShield, title: 'Verified Listings', desc: 'Every listing is reviewed to ensure authenticity and quality.' },
              { icon: FiUsers, title: 'Active Community', desc: 'Join thousands of pet lovers sharing experiences and advice.' },
              { icon: FiCheckCircle, title: 'Easy Process', desc: 'Simple listing creation, search, and communication tools.' },
              { icon: FiMapPin, title: 'Pan India Coverage', desc: 'Available across 50+ cities with local listings near you.' },
              { icon: FiStar, title: 'Featured Pets', desc: 'Premium visibility for pets that deserve extra attention.' },
              { icon: FiSmile, title: 'Happy Families', desc: 'Over 10,000 successful adoptions and counting.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Our Journey
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Key milestones in our mission to connect pets with loving families
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-800 transform sm:-translate-x-px" />
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.title}
                  className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  {...stagger}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex-shrink-0 relative z-10 w-8 h-8 rounded-full bg-primary-500 border-4 border-white dark:border-neutral-800 shadow flex items-center justify-center">
                    <FiCheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'}`}>
                    <Card className="p-4 sm:p-5">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                        {milestone.year}
                      </span>
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Join Our Mission
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Be part of India's most trusted pet community. Whether you're looking to adopt, buy,
              or find a loving home for your pet, PetVerse is here for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button as={Link} to={ROUTES.BROWSE_PETS} size="lg" className="rounded-xl">
                Browse Pets
              </Button>
              <Button as={Link} to={ROUTES.LOGIN} variant="outline" size="lg" className="rounded-xl">
                Join PetVerse
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;