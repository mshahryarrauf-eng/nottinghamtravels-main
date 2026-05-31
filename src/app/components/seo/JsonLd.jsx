/**
 * JSON-LD Structured Data helpers for Nottingham Travels.
 *
 * Drop <OrganizationSchema /> into the root layout once.
 * Drop <BreadcrumbSchema items={[...]} /> into individual pages.
 * Drop <TravelAgencySchema /> in the about / home page.
 */

import { SITE } from "@/lib/seo";

/** Organisation schema — add once in the root (app) layout */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Nottingham Travels",
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nottingham",
      addressCountry: "GB",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      // Add your real social media URLs here:
      // "https://www.facebook.com/NottinghamTravels",
      // "https://www.instagram.com/NottinghamTravels",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb schema — add per-page.
 *
 * @param {{ items: Array<{ name: string; url: string }> }} props
 *
 * Example:
 *   <BreadcrumbSchema items={[
 *     { name: "Home", url: "/" },
 *     { name: "Special Offers", url: "/special-offers" },
 *   ]} />
 */
export function BreadcrumbSchema({ items = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ schema — add to pages that have a FAQ section.
 *
 * @param {{ faqs: Array<{ question: string; answer: string }> }} props
 */
export function FAQSchema({ faqs = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Offer / product schema for special offer detail pages.
 *
 * @param {{ offer: object }} props
 */
export function OfferSchema({ offer }) {
  if (!offer) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.title,
    description: offer.description,
    image: offer.image,
    offers: {
      "@type": "Offer",
      priceCurrency: offer.currency || "GBP",
      price: offer.discountedPrice || offer.originalPrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Nottingham Travels",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
