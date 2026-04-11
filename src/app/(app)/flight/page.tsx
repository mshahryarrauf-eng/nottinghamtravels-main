import Hero from "@/app/components/home/hero";
import TopDestination from "@/app/components/home/topDestination";
import Highlights from "@/app/components/highlights"
import { OfferedAirlinesSection } from "@/app/components/airlines/offeredAirlineSections";
import HomeOffers from "@/app/components/home/homeOffer";
import ScrollPopupForm from "@/app/components/home/scrollPopupForm";
import { connectDB } from "@/lib/db";
import Offer from "@/models/offer";

function parseCategory(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return raw ? [raw] : []; }
  }
  return [];
}

async function getFeaturedOffers() {
  try {
    await connectDB();
    const offers = await Offer.find({ active: true, showOnHome: true })
      .sort({ createdAt: -1 })
      .lean();

    return offers.map((o) => {
      const originalPrice = o.amount ?? 0;
      const discountPercent = o.discount ?? 0;
      const categoryArr = parseCategory(o.category);
      return {
        _id: o._id.toString(),
        title: o.title,
        destination: o.destination || "",
        category: (o.type || "package").toLowerCase(),
        categories: categoryArr,
        tag: categoryArr[0] || "",
        discount: discountPercent,
        originalPrice,
        discountedPrice: discountPercent > 0
          ? Math.round(originalPrice * (1 - discountPercent / 100))
          : originalPrice,
        currency: o.currency || "GBP",
        validUntil: o.dateTo?.toISOString() ?? o.dateFrom?.toISOString() ?? null,
        description: o.description || "",
        image: Array.isArray(o.images) && o.images.length > 0 ? o.images[0] : "/placeholder.jpg",
        slug: o.slug,
      };
    });
  } catch (err) {
    console.error("Failed to fetch home offers:", err);
    return [];
  }
}

export default async function Home() {
  const featuredOffers = await getFeaturedOffers();

  return (
    <div>
      <Hero />
      <TopDestination />
      <Highlights />
      {featuredOffers.length > 0 && <HomeOffers offers={featuredOffers} />}
      <OfferedAirlinesSection />
      {/* Scroll-triggered popup — client component, renders after 50% scroll */}
      <ScrollPopupForm />
    </div>
  );
}
