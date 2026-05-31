"use client"

import { useState, useMemo } from "react"
import OfferFilters, { FilterType } from "./offerFilters"
import OfferGrid from "./offerGrid"
import { Offer } from "@/app/data/offers"

interface OfferFiltersClientProps {
  initialOffers: Offer[]
}

export default function OfferFiltersClient({
  initialOffers,
}: OfferFiltersClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  // ✅ Filtering logic
  const filteredOffers = useMemo(() => {
    if (activeFilter === "all") return initialOffers

    return initialOffers.filter(
      (o) => (o.category || "").toLowerCase() === activeFilter
    )
  }, [activeFilter, initialOffers])

  return (
    <section className="relative pb-16  px-6 bg-gradient-to-b from-background to-background/60 overflow-hidden">
      
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">

        {/* 🔥 Sticky Filters */}
        <div className="sticky top-24 z-20">
          <div className="backdrop-blur-xl bg-background/70 border border-border rounded-2xl p-4 shadow-sm">
            <OfferFilters
              active={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground text-center">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredOffers.length}
          </span>{" "}
          {filteredOffers.length === 1 ? "offer" : "offers"}
          {activeFilter !== "all" && ` in ${activeFilter}s`}
        </p>

        {/* 🔥 Offers Grid (4 per row handled in OfferGrid) */}
        <OfferGrid offers={filteredOffers} />
      </div>
    </section>
  )
}