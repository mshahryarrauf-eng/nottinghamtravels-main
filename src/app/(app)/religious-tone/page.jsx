import ReligiousTourHero from "@/app/components/religiousTour/religiousTourHero";
import ReligiousOffersSection from "@/app/components/religiousTour/religiousOffersSection";

async function getReligiousOffers() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/offers?religious=1`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.offers || [];
  } catch (err) {
    console.error("Failed to fetch religious offers:", err);
    return [];
  }
}

export const metadata = {
  title: "Religious Tours | Hajj, Umrah & Pilgrimage Packages",
  description:
    "Book Hajj, Umrah, and religious pilgrimage packages. Trusted travel partner for spiritual journeys worldwide.",
};

export default async function ReligiousTourPage() {
  const offers = await getReligiousOffers();

  return (
    <main>
      <ReligiousTourHero />
      <ReligiousOffersSection offers={offers} />
    </main>
  );
}