// src/app/(app)/special-offers/page.jsx
// ─── Server Component — fetches live data from MongoDB via the API ─────────────
// No "use client" here. Filtering logic lives in OfferFiltersClient below.

import OfferHero from "../../components/specialOffer/offerHero";
import OfferFiltersClient from "../../components/specialOffer/offerFiltersClient";

async function getOffers() {
  try {
    // ?frontend=1 tells the route to map the DB shape to the new frontend Offer type
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/offers?frontend=1`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.offers || [];
  } catch (err) {
    console.error("Failed to fetch offers:", err);
    return [];
  }
}

export const metadata = {
  title: "Special Travel Offers | Exclusive Holiday Deals",
  description:
    "Discover our exclusive travel offers and holiday deals. Save on flights, hotels, and vacation packages.",
};

export default async function SpecialOffersPage() {
  const offers = await getOffers();

  return (
    <main>
      <OfferHero />
      <OfferFiltersClient initialOffers={offers} />
    </main>
  );
}
