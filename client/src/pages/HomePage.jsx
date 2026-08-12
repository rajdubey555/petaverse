import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHeart,
  FiMapPin,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiHome,
  FiAlertCircle,
  FiMessageCircle,
  FiCheckCircle,
  FiActivity,
  FiSmile,
  FiAward,
  FiPlusCircle,
  FiCompass,
} from 'react-icons/fi';
import { useGetFeaturedPetsQuery, useGetSpeciesStatsQuery } from '../store/api/petApi';
import { PetCard } from '../components/pet';
import { Button, Spinner, EmptyState, Card, LazyImage, Badge, Pagination } from '../components/common';
import { ROUTES } from '../config/routes';
import { SPECIES_CONFIG } from '../config/constants';
import { cn } from '../utils/cn';
import { formatCount } from '../utils/formatters';

// ── Hero Slides Data ──
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Find Your Perfect Furry Companion 🐶',
    subtitle: 'Thousands of verified pets waiting to bring joy, love, and loyalty to your home.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80&fm=webp',
    badge: 'India’s #1 Pet Portal 🐾',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    primaryCta: 'Explore Pets',
    primaryLink: ROUTES.PETS.BROWSE,
    secondaryCta: 'Post a Pet',
    secondaryLink: ROUTES.PETS.CREATE,
  },
  {
    id: 2,
    title: 'Adopt, Rehome & Save Lives 🐱',
    subtitle: 'Give homeless and rescued pets a second chance at happiness with safe verified adoption.',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1600&q=80&fm=webp',
    badge: '100% Safe Adoption 💖',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    primaryCta: 'Browse Adoptions',
    primaryLink: `${ROUTES.PETS.BROWSE}?listingType=adoption`,
    secondaryCta: 'How It Works',
    secondaryLink: '#how-it-works',
  },
  {
    id: 3,
    title: 'Lost Something Special? 🚨',
    subtitle: 'Broadcast lost & found alerts across your local city community in seconds.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80&fm=webp',
    badge: 'Instant Lost & Found 📢',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-400/30',
    primaryCta: 'Lost & Found Center',
    primaryLink: ROUTES.PETS.LOST_FOUND,
    secondaryCta: 'Report Lost Pet',
    secondaryLink: `${ROUTES.PETS.CREATE}?listingType=lost`,
  },
];

// ── Stats Data ──
const stats = [
  { icon: FiHeart, value: '15,000+', label: 'Pets Listed', color: 'from-amber-400 to-orange-500' },
  { icon: FiUsers, value: '8,500+', label: 'Happy Families', color: 'from-sky-400 to-blue-600' },
  { icon: FiSmile, value: '3,200+', label: 'Successful Adoptions', color: 'from-emerald-400 to-teal-600' },
  { icon: FiMapPin, value: '250+', label: 'Cities Covered', color: 'from-purple-400 to-indigo-600' },
];

// ── Categories Data (counts fetched live from API) ──
const categories = [
  { species: 'dog',     label: 'Dogs',      icon: '🐕', color: 'from-amber-500 to-orange-600' },
  { species: 'cat',     label: 'Cats',      icon: '🐈', color: 'from-sky-500 to-blue-600' },
  { species: 'bird',    label: 'Birds',     icon: '🐦', color: 'from-emerald-500 to-teal-600' },
  { species: 'fish',    label: 'Fish',      icon: '🐟', color: 'from-cyan-500 to-indigo-600' },
  { species: 'rabbit',  label: 'Rabbits',   icon: '🐰', color: 'from-pink-500 to-rose-600' },
  { species: 'hamster', label: 'Hamsters',  icon: '🐹', color: 'from-yellow-400 to-amber-500' },
  { species: 'reptile', label: 'Reptiles',  icon: '🦎', color: 'from-green-500 to-emerald-700' },
  { species: 'other',   label: 'Other Pets',icon: '🐾', color: 'from-purple-500 to-pink-600' },
];

// ── How It Works Steps ──
const howItWorks = [
  {
    step: '01',
    icon: FiSearch,
    title: 'Browse & Filter',
    description: 'Search thousands of verified pet listings by city, breed, gender, and species.',
  },
  {
    step: '02',
    icon: FiMessageCircle,
    title: 'Direct Chat',
    description: 'Connect securely with pet parents and shelters without middleman fees.',
  },
  {
    step: '03',
    icon: FiShield,
    title: 'Safe Verification',
    description: 'Review pet health records, vaccination badges, and verified user profiles.',
  },
  {
    step: '04',
    icon: FiHeart,
    title: 'Welcome Home',
    description: 'Finalize adoption arrangements and welcome your new best friend home!',
  },
];

// ── Adoption Stories & Testimonials Carousel Data ──
const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma & Max 🐶',
    role: 'Golden Retriever Adoption (Delhi)',
    petType: 'Golden Retriever',
    petEmoji: '🐕',
    badge: 'Adoption Story',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80&fm=webp',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80&fm=webp',
    text: 'PetVerse made finding our puppy so seamless! The verified health badges gave us complete peace of mind, and Max has brought endless wagging tails and smiles to our home.',
    rating: 5,
    date: 'Adopted 2 weeks ago',
  },
  {
    id: 2,
    name: 'Rahul Patel & Luna 🐈',
    role: 'Persian Cat Rescue (Mumbai)',
    petType: 'Persian Cat',
    petEmoji: '🐱',
    badge: 'Rescue Story',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80&fm=webp',
    petImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80&fm=webp',
    text: 'I was looking for a rescue cat for months. Through PetVerse, I connected directly with a caring foster family and welcomed Luna home within just 3 days!',
    rating: 5,
    date: 'Adopted 1 month ago',
  },
  {
    id: 3,
    name: 'Ananya Gupta & Charlie 🐕',
    role: 'Beagle Rehoming (Bengaluru)',
    petType: 'Beagle',
    petEmoji: '🐾',
    badge: 'Happy Rehoming',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80&fm=webp',
    petImage: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=80&fm=webp',
    text: 'When my Beagle had puppies, PetVerse helped me screen responsible pet lovers. The direct chat made it safe and transparent to find loving families.',
    rating: 5,
    date: 'Rehomed 3 weeks ago',
  },
  {
    id: 4,
    name: 'Vikram Singh & Snowball 🐰',
    role: 'Angora Rabbit Adoption (Pune)',
    petType: 'Angora Rabbit',
    petEmoji: '🐰',
    badge: 'Fluffy Adoption',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80&fm=webp',
    petImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80&fm=webp',
    text: 'Snowball has brought so much warmth to our apartment! Finding rabbit care guides and a verified seller on PetVerse was smooth and worry-free.',
    rating: 5,
    date: 'Adopted 1 month ago',
  },
  {
    id: 5,
    name: 'Kavita Reddy & Rocky 🐕',
    role: 'German Shepherd Rescue (Hyderabad)',
    petType: 'German Shepherd',
    petEmoji: '🦮',
    badge: 'Hero Rescue',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80&fm=webp',
    petImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80&fm=webp',
    text: 'Rocky was a shelter rescue pet. PetVerse connected us with the local rescue foundation in Hyderabad. Best pet platform in India hands down!',
    rating: 5,
    date: 'Adopted 2 months ago',
  },
];

// ── Care Tips ──
const careTips = [
  {
    icon: '🏠',
    title: 'Home Preparation',
    desc: 'Remove hazards, secure fences, and set up a cozy sleeping spot before your pet arrives.',
  },
  {
    icon: '💉',
    title: 'Vaccination & Care',
    desc: 'Keep records updated and schedule annual vet checks for long-term health.',
  },
  {
    icon: '🍖',
    title: 'Nutrition & Diet',
    desc: 'Provide species-appropriate balanced food and ensure fresh drinking water daily.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const HomePage = () => {
  const navigate = useNavigate();

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  // Auto Play Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Testimonials auto-carousel timer (switches every 4 seconds unless hovered)
  useEffect(() => {
    if (isTestimonialHovered) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isTestimonialHovered]);

  // Preload all Testimonial pet images and user avatars for 0ms instant loading
  useEffect(() => {
    testimonials.forEach((t) => {
      if (t.petImage) {
        const img = new Image();
        img.src = t.petImage;
      }
      if (t.avatar) {
        const img = new Image();
        img.src = t.avatar;
      }
    });
  }, []);

  const [featuredPage, setFeaturedPage] = useState(1);
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedPetsQuery({ limit: 48 });
  const { data: speciesStatsData } = useGetSpeciesStatsQuery();
  const speciesCounts = speciesStatsData?.data || {};
  const allFeaturedPets = useMemo(() => featuredData?.data || [], [featuredData]);
  const FEATURED_ITEMS_PER_PAGE = 12;
  const totalFeaturedPages = Math.ceil(allFeaturedPets.length / FEATURED_ITEMS_PER_PAGE);

  const displayedFeaturedPets = useMemo(() => {
    const start = (featuredPage - 1) * FEATURED_ITEMS_PER_PAGE;
    return allFeaturedPets.slice(start, start + FEATURED_ITEMS_PER_PAGE);
  }, [allFeaturedPets, featuredPage]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PETS.BROWSE}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(ROUTES.PETS.BROWSE);
    }
  };

  const activeTestimonial = testimonials[testimonialIndex];

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────
          1. HERO CAROUSEL BANNER WITH LIVE SEARCH
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center bg-neutral-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* Background WebP Image */}
            <LazyImage
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay for High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-neutral-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Animated Paw Background Effects */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute top-12 left-[10%] text-6xl opacity-10 select-none"
          >
            🐾
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="absolute bottom-20 right-[15%] text-7xl opacity-10 select-none"
          >
            🐶
          </motion.div>
        </div>

        {/* Hero Slide Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white space-y-6">
            {/* Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md',
                HERO_SLIDES[currentSlide].badgeColor
              )}
            >
              <span>{HERO_SLIDES[currentSlide].badge}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md"
            >
              {HERO_SLIDES[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base sm:text-lg text-neutral-300 font-medium leading-relaxed max-w-xl"
            >
              {HERO_SLIDES[currentSlide].subtitle}
            </motion.p>

            {/* Live Search Bar Box inside Hero */}
            <motion.form
              onSubmit={handleHeroSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg"
            >
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search breed, city (e.g. Golden Retriever, Delhi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-2xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xl"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FiSearch className="w-4 h-4" />
                Search
              </button>
            </motion.form>

            {/* Hero CTAs */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <Link
                to={HERO_SLIDES[currentSlide].primaryLink}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                {HERO_SLIDES[currentSlide].primaryCta}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={HERO_SLIDES[currentSlide].secondaryLink}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                {HERO_SLIDES[currentSlide].secondaryCta}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Slider Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. IMPACT STATS BAR
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl backdrop-blur-md">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 p-2">
              <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{stat.value}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. EXPLORE BY SPECIES CATEGORY (3D CARD HOVER)
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" className="mx-auto">Category Showcase 🐾</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Browse by Pet Category
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Find dogs, cats, birds, fishes, and exotic pets looking for caring homes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.species}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <Link
                to={`${ROUTES.PETS.BROWSE}?species=${cat.species}`}
                className="group flex flex-col items-center p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-md group-hover:rotate-6 transition-transform', cat.color)}>
                  <span>{cat.icon}</span>
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mt-3 group-hover:text-amber-500 transition-colors">
                  {cat.label}
                </h3>
                <span className="text-[10px] font-semibold text-neutral-400 mt-0.5">
                  {speciesCounts[cat.species] !== undefined
                    ? speciesCounts[cat.species].toLocaleString()
                    : '—'}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. FEATURED PETS CAROUSEL & GRID
      ───────────────────────────────────────────────────────── */}
      <section id="featured-section" className="bg-neutral-100/70 dark:bg-neutral-800/40 py-12 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="amber" className="mb-2">Staff Picks ⭐</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                Featured Pets Ready for Adoption
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Handpicked verified pets looking for loving families right now.
              </p>
            </div>
            <Link
              to={ROUTES.PETS.BROWSE}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline self-start sm:self-auto"
            >
              View All Pets ({allFeaturedPets.length > 0 ? formatCount(allFeaturedPets.length) : '40+'})
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" variant="primary" label="Loading featured pets..." />
            </div>
          ) : displayedFeaturedPets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFeaturedPets.map((pet) => (
                  <motion.div
                    key={pet._id || pet.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PetCard pet={pet} />
                  </motion.div>
                ))}
              </div>

              {totalFeaturedPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination
                    currentPage={featuredPage}
                    totalPages={totalFeaturedPages}
                    totalItems={allFeaturedPets.length}
                    pageSize={FEATURED_ITEMS_PER_PAGE}
                    onPageChange={(p) => {
                      setFeaturedPage(p);
                      const el = document.getElementById('featured-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={FiHeart}
              title="No featured pets right now"
              description="Check out all available listings to discover wonderful companions."
              action={{ label: 'Explore Pets', to: ROUTES.PETS.BROWSE }}
            />
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. HOW IT WORKS (STEP BY STEP)
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="success" className="mx-auto">Simple Process 🚀</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
            How PetVerse Works
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Adopting or listing a pet is fast, transparent, and completely safe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-xl transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700">{item.step}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. LOST & FOUND ALERT CAROUSEL BANNER
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
          {/* Background Glow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30">
                <FiAlertCircle className="w-4 h-4 animate-pulse text-yellow-300" />
                <span>Emergency Community Alert 🚨</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Lost or Found a Pet in Your Area?
              </h2>
              <p className="text-sm text-red-100 font-medium leading-relaxed">
                Reunite lost pets with their worried families. Post instant alerts or browse missing pets reported near your city.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                to={ROUTES.PETS.LOST_FOUND}
                className="px-6 py-3.5 bg-white text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl shadow-lg text-center transition-all"
              >
                Browse Lost & Found
              </Link>
              <Link
                to={`${ROUTES.PETS.CREATE}?listingType=lost`}
                className="px-6 py-3.5 bg-black/30 hover:bg-black/40 text-white font-semibold text-sm rounded-xl backdrop-blur-md border border-white/20 text-center transition-all"
              >
                Report Missing Pet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. PET CARE TIPS & ADOPTION GUIDE
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="primary" className="mx-auto">Pet Parenting 💡</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Essential Pet Care Guides
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Helpful resources to ensure your pet stays happy, healthy, and safe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careTips.map((tip) => (
            <div
              key={tip.title}
              className="p-6 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-md transition-all space-y-3"
            >
              <span className="text-3xl">{tip.icon}</span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{tip.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          8. TESTIMONIALS & ADOPTION STORIES (PAUSE ON HOVER CAROUSEL)
      ───────────────────────────────────────────────────────── */}
      <section className="bg-amber-500/5 dark:bg-neutral-800/60 py-16 border-y border-amber-500/20 dark:border-neutral-700/60 relative">
        {/* Background Decorative Paw Elements */}
        <div className="absolute top-6 left-10 text-6xl opacity-10 select-none pointer-events-none">🐾</div>
        <div className="absolute bottom-6 right-10 text-6xl opacity-10 select-none pointer-events-none">🐶</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
              <span>Happy Families 💕</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Testimonials & Adoption Stories 🐾
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Real heart-warming adoption stories from pet parents across India.
            </p>
          </motion.div>

          {/* Testimonial Carousel Card Container with Hover Event Listeners */}
          <div
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
            className="max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.98 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-700 shadow-2xl relative overflow-hidden group"
              >
                {/* Decorative Accent Glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Left Column: Pet Image & Badge */}
                  <div className="md:col-span-5 relative">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500/40 relative">
                      <img
                        src={activeTestimonial.petImage}
                        alt={activeTestimonial.petType}
                        loading="eager"
                        decoding="async"
                        fetchpriority="high"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Pet Species Badge Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold shadow">
                          {activeTestimonial.petEmoji} {activeTestimonial.petType}
                        </span>
                        <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full font-medium">
                          {activeTestimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quote, Rating & Adopter Info */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Header Badge & Rating */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                        {activeTestimonial.badge} 🐾
                      </span>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 italic font-medium leading-relaxed">
                      "{activeTestimonial.text}"
                    </p>

                    {/* Adopter Profile Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <img
                        src={activeTestimonial.avatar}
                        alt={activeTestimonial.name}
                        loading="eager"
                        decoding="async"
                        fetchpriority="high"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-md flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          {activeTestimonial.name}
                          <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                          {activeTestimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bar at Bottom */}
                {!isTestimonialHovered && (
                  <motion.div
                    key={`bar-${activeTestimonial.id}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-1 bg-amber-500"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Testimonials Controls (Prev/Next & Paw Dot Indicators) */}
            <div className="flex items-center justify-between mt-6 px-2">
              <button
                type="button"
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-amber-500 hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous Story
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTestimonialIndex(idx)}
                    className={cn(
                      'transition-all duration-300 flex items-center justify-center text-xs',
                      testimonialIndex === idx
                        ? 'w-7 h-7 rounded-full bg-amber-500 text-white font-bold shadow-md scale-110'
                        : 'w-6 h-6 rounded-full bg-white dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    )}
                  >
                    🐾
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-amber-500 hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Next Story
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          9. FINAL CALL TO ACTION (CTA)
      ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 p-8 sm:p-14 text-white text-center shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Give a Pet a Loving Home? 🐾
            </h2>
            <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
              Join thousands of pet lovers across India. Post a pet for adoption or search for your perfect companion today.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={ROUTES.PETS.BROWSE}
                className="px-8 py-4 bg-white text-neutral-900 hover:bg-neutral-100 font-extrabold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <FiCompass className="w-5 h-5 text-amber-500" />
                Explore Available Pets
              </Link>
              <Link
                to={ROUTES.PETS.CREATE}
                className="px-8 py-4 bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <FiPlusCircle className="w-5 h-5 text-amber-400" />
                Post a Pet Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;