import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../../config/constants';

/**
 * SEO — Reusable meta tags component using react-helmet-async.
 *
 * Usage:
 *   <SEO title="Browse Pets" description="Find your perfect companion" />
 *   <SEO title="Pet Details" canonicalUrl="https://petverse.app/pets/abc123" noindex />
 *
 * Props are merged with sensible defaults from APP_NAME.
 */

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex = false,
  children,
}) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const defaultDescription =
    'PetVerse — Find your perfect companion. Adopt, rehome, or report lost & found pets in your area.';
  const defaultKeywords =
    'pet adoption, rehome pets, lost and found pets, adopt a dog, adopt a cat, pet rehoming';
  const defaultOgImage = '/og-image.png';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={APP_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Additional children (e.g., JSON-LD structured data) */}
      {children}
    </Helmet>
  );
};

export default SEO;