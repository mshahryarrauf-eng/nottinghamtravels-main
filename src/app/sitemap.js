/**
 * Dynamic sitemap for Nottingham Travels.
 * Next.js will serve this at /sitemap.xml automatically.
 *
 * Static routes are listed manually.
 * Dynamic offer slugs are fetched from the DB at build / revalidation time.
 */

import { connectDB } from "@/lib/db";
import Offer from "@/models/offer";

const BASE_URL =
  process.env.NEXT_PUBLIC_HOSTNAME || "https://www.nottinghamtravels.co.uk";

/** Static pages with their change frequency and priority */
const STATIC_ROUTES = [
  { path: "/",                priority: "1.0",  changeFrequency: "daily" },
  { path: "/about-us",        priority: "0.8",  changeFrequency: "monthly" },
  { path: "/destinations",    priority: "0.9",  changeFrequency: "weekly" },
  { path: "/flight",          priority: "0.9",  changeFrequency: "daily" },
  { path: "/hotel",           priority: "0.9",  changeFrequency: "daily" },
  { path: "/special-offers",  priority: "0.9",  changeFrequency: "daily" },
  { path: "/religious-tone",  priority: "0.8",  changeFrequency: "weekly" },
  { path: "/contact-us",      priority: "0.7",  changeFrequency: "monthly" },
  { path: "/tailor-made-query", priority: "0.7", changeFrequency: "monthly" },
];

export default async function sitemap() {
  // ── Static routes ──────────────────────────────────────────────────────────
  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority: parseFloat(priority),
  }));

  // ── Dynamic offer detail pages ─────────────────────────────────────────────
  let offerEntries = [];
  try {
    await connectDB();
    const offers = await Offer.find({ active: true }, { slug: 1, updatedAt: 1 }).lean();
    offerEntries = offers
      .filter((o) => o.slug)
      .map((o) => ({
        url: `${BASE_URL}/offer-details/${o.slug}`,
        lastModified: o.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (err) {
    console.error("Sitemap: failed to fetch offer slugs:", err);
  }

  return [...staticEntries, ...offerEntries];
}
