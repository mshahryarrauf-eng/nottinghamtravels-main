
import ReligiousTourHero from "@/app/components/religiousTour/religiousTourHero";
import ReligiousTourFiltersClient from "@/app/components/religiousTour/religiousTourFilterClient";

async function getTours() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/religious-tours`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.tours || [];
  } catch (err) {
    console.error("Failed to fetch religious tours:", err);
    return [];
  }
}

export const metadata = {
  title: "Religious Tours | Hajj, Umrah & Pilgrimage Packages",
  description:
    "Book Hajj, Umrah, and religious pilgrimage packages. Trusted travel partner for spiritual journeys worldwide.",
};

export default async function ReligiousTourPage() {
  const tours = await getTours();

  return (
    <main className="mt-10">
      <ReligiousTourHero />
      <ReligiousTourFiltersClient initialTours={tours} />
    </main>
  );
}
