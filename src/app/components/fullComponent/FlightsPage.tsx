"use client";

import Hero from "@/app/components/home/hero";
import TopDestination from "@/app/components/home/topDestination";
import Highlights from "@/app/components/highlights";
import { OfferedAirlinesSection } from "@/app/components/airlines/offeredAirlineSections";
import HomeOffers from "@/app/components/home/homeOffer";
import ScrollPopupForm from "@/app/components/home/scrollPopupForm";

export default function FlightsPage({ featuredOffers }) {
  return (
    <div>
      <Hero />
      <TopDestination />
      <Highlights />
      {featuredOffers.length > 0 && <HomeOffers offers={featuredOffers} />}
      <OfferedAirlinesSection />
      <ScrollPopupForm />
    </div>
  );
}