import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiGithub,
  FiMail,
} from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { APP_NAME } from '../../config/constants';

const footerLinks = {
  company: [
    { to: ROUTES.ABOUT, label: 'About Us' },
    { to: ROUTES.CONTACT, label: 'Contact Us' },
    { to: ROUTES.BROWSE_PETS, label: 'Browse Pets' },
    { to: ROUTES.LOST_FOUND, label: 'Lost & Found' },
  ],
  legal: [
    { to: ROUTES.PRIVACY, label: 'Privacy Policy' },
    { to: ROUTES.TERMS, label: 'Terms & Conditions' },
  ],
  social: [
    {
      href: 'https://facebook.com',
      icon: FiFacebook,
      label: 'Facebook',
    },
    {
      href: 'https://twitter.com',
      icon: FiTwitter,
      label: 'Twitter',
    },
    {
      href: 'https://instagram.com',
      icon: FiInstagram,
      label: 'Instagram',
    },
    {
      href: 'https://github.com',
      icon: FiGithub,
      label: 'GitHub',
    },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      {/* Matching Header Accent */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:pr-8">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-3 mb-5 group"
            >
              {/* Logo */}
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all">
                <span className="text-white text-2xl select-none">
                  🐾
                </span>
              </div>

              {/* Brand Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Pet
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      Verse
                    </span>
                  </span>

                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                    Pet Hub 🐶
                  </span>
                </div>

                <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                  Adopt • Reunite • Connect
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-sm">
              Connecting loving homes with pets in need. Your trusted platform
              for pet adoption, rehoming, and lost & found services.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
              <FiHeart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Made with love for pets
              </span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-widest mb-5">
              Company
            </h4>

            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-amber-500 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-widest mb-5">
              Legal
            </h4>

            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-amber-500 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-widest mb-5">
              Follow Us
            </h4>

            <div className="flex items-center gap-2.5">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:border-transparent hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>

            {/* Email */}
            <a
              href="mailto:support@petverse.app"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <FiMail className="w-4 h-4" />
              <span>support@petverse.app</span>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            <span>Built with</span>
            <FiHeart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for pets</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
