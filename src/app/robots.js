/**
 * robots.txt for Nottingham Travels.
 * Next.js serves this at /robots.txt automatically.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_HOSTNAME || "https://www.nottinghamtravels.co.uk";

export default function robots() {
  return {
    rules: [
      {
        // Allow all well-behaved crawlers on public pages
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/",
          "/api/",
          "/profile/",
          "/bookings/",
          "/booking-details/",
          "/hotels-details/",
          "/package-details/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
