/**
 * Centralised SEO helpers for Nottingham Travels.
 *
 * Usage — static export in a Server Component page:
 *   import { buildMetadata } from "@/lib/seo";
 *   export const metadata = buildMetadata({ ... });
 *
 * Usage — dynamic metadata in a Server Component page:
 *   export async function generateMetadata({ params }) {
 *     return buildMetadata({ title: `${params.slug} | Nottingham Travels` });
 *   }
 */

const SITE = {
  name: "Nottingham Travels",
  url: process.env.NEXT_PUBLIC_HOSTNAME || "https://www.nottinghamtravels.co.uk",
  description:
    "Nottingham Travels — ATOL & ABTA protected travel agency based in Nottingham, UK. Book flights, hotels, holiday packages, Hajj & Umrah tours at the best prices.",
  logo: "/assets/Notigham-logo.png",
  twitterHandle: "@NottinghamTravels",
  locale: "en_GB",
};

/**
 * Build a complete Next.js `Metadata` object.
 *
 * @param {object} opts
 * @param {string}   [opts.title]       - Page title (without site suffix)
 * @param {string}   [opts.description] - Page meta description
 * @param {string[]} [opts.keywords]    - Additional keywords
 * @param {string}   [opts.path]        - Canonical path, e.g. "/about-us"
 * @param {string}   [opts.image]       - OG image URL (absolute or relative)
 * @param {string}   [opts.type]        - OG type, default "website"
 * @param {boolean}  [opts.noIndex]     - Set true to block indexing (e.g. admin pages)
 */
export function buildMetadata({
  title,
  description = SITE.description,
  keywords = [],
  path = "",
  image,
  type = "website",
  noIndex = false,
} = {}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.name;
  const canonical = `${SITE.url}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE.url}${image}`
    : `${SITE.url}/assets/Notigham-logo.png`;

  const baseKeywords = [
    "Nottingham Travels",
    "travel agency Nottingham",
    "ATOL protected",
    "ABTA travel",
    "cheap flights UK",
    "holiday packages",
    "hotel bookings",
  ];

  return {
    metadataBase: new URL(SITE.url),
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords].join(", "),

    // ── Canonical ──────────────────────────────────────────────────────────────
    alternates: {
      canonical,
    },

    // ── Open Graph ─────────────────────────────────────────────────────────────
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE.name,
      type,
      locale: SITE.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },

    // ── Twitter / X card ───────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: SITE.twitterHandle,
      images: [ogImage],
    },

    // ── Robots ─────────────────────────────────────────────────────────────────
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    // ── Verification placeholders ───────────────────────────────────────────────
    // Replace values with your real tokens from Search Console / Bing / Yandex
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
      other: {
        "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
      },
    },
  };
}

/** Convenience: site-wide defaults exported as a plain object */
export const defaultMetadata = buildMetadata();

/** Site constants re-exported for use in JSON-LD schemas etc. */
export { SITE };
