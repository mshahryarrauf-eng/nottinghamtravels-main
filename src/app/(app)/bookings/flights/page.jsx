"use client";

// src/app/(app)/bookings/flights/page.jsx
// ─── Reads flight search results from sessionStorage ─────────────────────────

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, Clock, ChevronLeft, ArrowRight, SlidersHorizontal } from "lucide-react";

// ── Helper to safely pull itineraries from various Sabre response shapes ───────
function extractItineraries(data) {
  // Sabre BFM response
  if (data?.groupedItineraryResponse?.itineraryGroups) {
    const groups = data.groupedItineraryResponse.itineraryGroups;
    const legs = data.groupedItineraryResponse.legDescs || [];
    const schedules = data.groupedItineraryResponse.scheduleDescs || [];
    const itineraries = [];
    groups.forEach((group) => {
      (group.itineraries || []).forEach((itin) => {
        (itin.pricingInformation || []).forEach((pricing) => {
          itineraries.push({ itin, pricing, legs, schedules });
        });
      });
    });
    return itineraries;
  }
  // Simple flat list fallback
  if (Array.isArray(data)) return data;
  if (data?.itineraries) return data.itineraries;
  return [];
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// ── Flight card for grouped Sabre BFM response ────────────────────────────────
function FlightCard({ item, index, searchParams }) {
  const { itin, pricing, legs, schedules } = item;

  // Pull price
  const totalFare =
    pricing?.fare?.totalFare?.amount ||
    pricing?.fare?.totalFare?.total ||
    "—";
  const currency =
    pricing?.fare?.totalFare?.currency || "";

  // Pull legs info
  const legRefs = itin.legs || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
    >
      {legRefs.map((legRef, li) => {
        const leg = legs.find((l) => l.id === legRef.ref) || {};
        const firstSched = schedules.find((s) => s.id === (leg.schedules?.[0]?.ref));
        const lastSched = schedules.find((s) => s.id === (leg.schedules?.[leg.schedules?.length - 1]?.ref));

        const depTime = firstSched?.departure?.time || "—";
        const arrTime = lastSched?.arrival?.time || "—";
        const depAirport = firstSched?.departure?.airport || searchParams?.origin || "—";
        const arrAirport = lastSched?.arrival?.airport || searchParams?.destination || "—";
        const carrier = firstSched?.carrier?.marketing || firstSched?.carrier?.operating || "—";
        const stops = (leg.schedules?.length || 1) - 1;
        const elapsedMinutes = leg.elapsedTime;

        return (
          <div key={li} className="flex items-center gap-4">
            {/* Carrier */}
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <Plane size={16} className="text-muted-foreground" />
            </div>

            {/* Route */}
            <div className="flex-1 grid grid-cols-3 items-center gap-2">
              <div>
                <p className="font-semibold text-base">{depTime}</p>
                <p className="text-xs text-muted-foreground">{depAirport}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{formatDuration(elapsedMinutes)}</p>
                <div className="flex items-center gap-1 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <Plane size={10} className="text-muted-foreground rotate-90" />
                  <div className="flex-1 h-px bg-border" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-base">{arrTime}</p>
                <p className="text-xs text-muted-foreground">{arrAirport}</p>
              </div>
            </div>

            {/* Carrier label */}
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">{carrier}</p>
            </div>
          </div>
        );
      })}

      {/* Price + Book */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Total price</p>
          <p className="text-xl font-bold">{currency} {typeof totalFare === "number" ? totalFare.toLocaleString() : totalFare}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition">
          Select <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Fallback card for flat / unknown shapes ────────────────────────────────────
function RawFlightCard({ flight, index }) {
  const price =
    flight.totalFare || flight.price || flight.amount ||
    flight.PricedItinerary?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.Amount || "—";
  const currency =
    flight.currency ||
    flight.PricedItinerary?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.CurrencyCode || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <Plane size={16} className="text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Flight option</p>
          <p className="text-xs text-muted-foreground">Details available on selection</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xl font-bold">{currency} {price}</p>
        <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition">
          Select <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function FlightResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("flightResults");
    const params = sessionStorage.getItem("flightSearchParams");
    if (saved) setResults(JSON.parse(saved));
    if (params) setSearchParams(JSON.parse(params));
  }, []);

  const itineraries = results ? extractItineraries(results) : [];
  const isBFM = results?.groupedItineraryResponse?.itineraryGroups;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-2"
          >
            <ChevronLeft size={14} /> Back to search
          </button>
          <h1 className="text-2xl font-semibold">
            {itineraries.length > 0
              ? `${itineraries.length} Flight${itineraries.length !== 1 ? "s" : ""} Found`
              : "Flight Results"}
          </h1>
          {searchParams && (
            <p className="text-sm text-muted-foreground mt-1">
              {searchParams.origin} → {searchParams.destination} · {searchParams.departureDate}
              {searchParams.tripType === "round" && searchParams.returnDate
                ? ` — ${searchParams.returnDate}` : ""}
            </p>
          )}
        </div>

        {/* No results */}
        {!results && (
          <div className="text-center py-24">
            <p className="text-lg font-semibold mb-2">No results</p>
            <p className="text-muted-foreground text-sm mb-6">Please go back and search again.</p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-90 transition"
            >
              New Search
            </button>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {isBFM
            ? itineraries.map((item, i) => (
                <FlightCard key={i} item={item} index={i} searchParams={searchParams} />
              ))
            : itineraries.map((flight, i) => (
                <RawFlightCard key={i} flight={flight} index={i} />
              ))
          }
        </div>
      </div>
    </div>
  );
}
