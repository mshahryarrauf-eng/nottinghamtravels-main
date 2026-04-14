// "use client";

// // src/app/(app)/bookings/flights/page.jsx
// // ─── Reads flight search results from sessionStorage ─────────────────────────

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Plane, Clock, ChevronLeft, ArrowRight, SlidersHorizontal } from "lucide-react";

// // ── Helper to safely pull itineraries from various Sabre response shapes ───────
// function extractItineraries(data) {
//   // Sabre BFM response
//   if (data?.groupedItineraryResponse?.itineraryGroups) {
//     const groups = data.groupedItineraryResponse.itineraryGroups;
//     const legs = data.groupedItineraryResponse.legDescs || [];
//     const schedules = data.groupedItineraryResponse.scheduleDescs || [];
//     const itineraries = [];
//     groups.forEach((group) => {
//       (group.itineraries || []).forEach((itin) => {
//         (itin.pricingInformation || []).forEach((pricing) => {
//           itineraries.push({ itin, pricing, legs, schedules });
//         });
//       });
//     });
//     return itineraries;
//   }
//   // Simple flat list fallback
//   if (Array.isArray(data)) return data;
//   if (data?.itineraries) return data.itineraries;
//   return [];
// }

// function formatDuration(minutes) {
//   if (!minutes) return "";
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return `${h}h ${m}m`;
// }

// // ── Flight card for grouped Sabre BFM response ────────────────────────────────
// function FlightCard({ item, index, searchParams }) {
//   const { itin, pricing, legs, schedules } = item;

//   // Pull price
//   const totalFare =
//     pricing?.fare?.totalFare?.amount ||
//     pricing?.fare?.totalFare?.total ||
//     "—";
//   const currency =
//     pricing?.fare?.totalFare?.currency || "";

//   // Pull legs info
//   const legRefs = itin.legs || [];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, delay: index * 0.04 }}
//       className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
//     >
//       {legRefs.map((legRef, li) => {
//         const leg = legs.find((l) => l.id === legRef.ref) || {};
//         const firstSched = schedules.find((s) => s.id === (leg.schedules?.[0]?.ref));
//         const lastSched = schedules.find((s) => s.id === (leg.schedules?.[leg.schedules?.length - 1]?.ref));

//         const depTime = firstSched?.departure?.time || "—";
//         const arrTime = lastSched?.arrival?.time || "—";
//         const depAirport = firstSched?.departure?.airport || searchParams?.origin || "—";
//         const arrAirport = lastSched?.arrival?.airport || searchParams?.destination || "—";
//         const carrier = firstSched?.carrier?.marketing || firstSched?.carrier?.operating || "—";
//         const stops = (leg.schedules?.length || 1) - 1;
//         const elapsedMinutes = leg.elapsedTime;

//         return (
//           <div key={li} className="flex items-center gap-4">
//             {/* Carrier */}
//             <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//               <Plane size={16} className="text-muted-foreground" />
//             </div>

//             {/* Route */}
//             <div className="flex-1 grid grid-cols-3 items-center gap-2">
//               <div>
//                 <p className="font-semibold text-base">{depTime}</p>
//                 <p className="text-xs text-muted-foreground">{depAirport}</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-xs text-muted-foreground">{formatDuration(elapsedMinutes)}</p>
//                 <div className="flex items-center gap-1 my-1">
//                   <div className="flex-1 h-px bg-border" />
//                   <Plane size={10} className="text-muted-foreground rotate-90" />
//                   <div className="flex-1 h-px bg-border" />
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="font-semibold text-base">{arrTime}</p>
//                 <p className="text-xs text-muted-foreground">{arrAirport}</p>
//               </div>
//             </div>

//             {/* Carrier label */}
//             <div className="flex-shrink-0 text-right hidden sm:block">
//               <p className="text-xs text-muted-foreground">{carrier}</p>
//             </div>
//           </div>
//         );
//       })}

//       {/* Price + Book */}
//       <div className="flex items-center justify-between pt-2 border-t border-border">
//         <div>
//           <p className="text-xs text-muted-foreground">Total price</p>
//           <p className="text-xl font-bold">{currency} {typeof totalFare === "number" ? totalFare.toLocaleString() : totalFare}</p>
//         </div>
//         <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition">
//           Select <ArrowRight size={13} />
//         </button>
//       </div>
//     </motion.div>
//   );
// }

// // ── Fallback card for flat / unknown shapes ────────────────────────────────────
// function RawFlightCard({ flight, index }) {
//   const price =
//     flight.totalFare || flight.price || flight.amount ||
//     flight.PricedItinerary?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.Amount || "—";
//   const currency =
//     flight.currency ||
//     flight.PricedItinerary?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.CurrencyCode || "";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, delay: index * 0.04 }}
//       className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-3"
//     >
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
//           <Plane size={16} className="text-muted-foreground" />
//         </div>
//         <div className="flex-1">
//           <p className="font-medium text-sm">Flight option</p>
//           <p className="text-xs text-muted-foreground">Details available on selection</p>
//         </div>
//       </div>
//       <div className="flex items-center justify-between pt-2 border-t border-border">
//         <p className="text-xl font-bold">{currency} {price}</p>
//         <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition">
//           Select <ArrowRight size={13} />
//         </button>
//       </div>
//     </motion.div>
//   );
// }

// // ── Main page ──────────────────────────────────────────────────────────────────
// export default function FlightResultsPage() {
//   const router = useRouter();
//   const [results, setResults] = useState(null);
//   const [searchParams, setSearchParams] = useState(null);

//   useEffect(() => {
//     const saved = sessionStorage.getItem("flightResults");
//     const params = sessionStorage.getItem("flightSearchParams");
//     if (saved) setResults(JSON.parse(saved));
//     if (params) setSearchParams(JSON.parse(params));
//   }, []);

//   const itineraries = results ? extractItineraries(results) : [];
//   const isBFM = results?.groupedItineraryResponse?.itineraryGroups;

//   return (
//     <div className="min-h-screen pt-24 pb-20 px-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-2"
//           >
//             <ChevronLeft size={14} /> Back to search
//           </button>
//           <h1 className="text-2xl font-semibold">
//             {itineraries.length > 0
//               ? `${itineraries.length} Flight${itineraries.length !== 1 ? "s" : ""} Found`
//               : "Flight Results"}
//           </h1>
//           {searchParams && (
//             <p className="text-sm text-muted-foreground mt-1">
//               {searchParams.origin} → {searchParams.destination} · {searchParams.departureDate}
//               {searchParams.tripType === "round" && searchParams.returnDate
//                 ? ` — ${searchParams.returnDate}` : ""}
//             </p>
//           )}
//         </div>

//         {/* No results */}
//         {!results && (
//           <div className="text-center py-24">
//             <p className="text-lg font-semibold mb-2">No results</p>
//             <p className="text-muted-foreground text-sm mb-6">Please go back and search again.</p>
//             <button
//               onClick={() => router.push("/")}
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-90 transition"
//             >
//               New Search
//             </button>
//           </div>
//         )}

//         {/* Results */}
//         <div className="space-y-4">
//           {isBFM
//             ? itineraries.map((item, i) => (
//                 <FlightCard key={i} item={item} index={i} searchParams={searchParams} />
//               ))
//             : itineraries.map((flight, i) => (
//                 <RawFlightCard key={i} flight={flight} index={i} />
//               ))
//           }
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

// src/app/(app)/bookings/flights/page.jsx
// ─── Correctly parses Sabre groupedItineraryResponse ─────────────────────────
// The Sabre BFM response stores all descriptors in flat arrays (scheduleDescs,
// legDescs etc.) and itineraries reference them by 1-based index via `ref`.
// This page resolves those refs before rendering.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Clock, ChevronLeft, ArrowRight, ChevronDown,
  ChevronUp, Luggage, AlertCircle, SlidersHorizontal, X
} from "lucide-react";

// ── Ref resolver ──────────────────────────────────────────────────────────────
// Sabre refs are 1-based, but some responses use sequential IDs.
// Safe lookup: try arr[ref - 1], fall back to arr.find(x => x.id === ref)
function byRef(arr, ref) {
  if (!arr || !ref) return null;
  return arr[ref - 1] ?? arr.find((x) => x.id === ref) ?? null;
}

// ── Cabin code → readable label ───────────────────────────────────────────────
const cabinLabels = { Y: "Economy", S: "Premium Economy", C: "Business", F: "First", W: "Premium Economy" };

// ── Duration formatter ────────────────────────────────────────────────────────
function fmtDuration(mins) {
  if (!mins) return "";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// ── Time formatter — "10:30" → "10:30" (already formatted in Sabre) ──────────
function fmtTime(t) {
  return t ? t.slice(0, 5) : "—";
}

// ── Parse one leg from legDescs + scheduleDescs ───────────────────────────────
function parseLeg(legDesc, scheduleDescs) {
  if (!legDesc) return null;
  const schedules = (legDesc.schedules || []).map((s) => byRef(scheduleDescs, s.ref)).filter(Boolean);
  const first = schedules[0];
  const last = schedules[schedules.length - 1];
  return {
    elapsedTime: legDesc.elapsedTime,
    stops: schedules.length - 1,
    departure: {
      airport: first?.departure?.airport ?? "—",
      time: fmtTime(first?.departure?.time),
      terminal: first?.departure?.terminal,
    },
    arrival: {
      airport: last?.arrival?.airport ?? "—",
      time: fmtTime(last?.arrival?.time),
      terminal: last?.arrival?.terminal,
    },
    carrier: first?.carrier?.marketing ?? first?.carrier?.operating ?? "—",
    flightNumber: first ? `${first.carrier?.marketing ?? ""}${first.carrier?.marketingFlightNumber ?? ""}` : "—",
    cabin: cabinLabels[schedules[0]?.carrier?.cabinCode ?? "Y"] ?? "Economy",
    equipment: first?.carrier?.equipment,
    schedules,
  };
}

// ── Parse one itinerary into a display-ready object ───────────────────────────
function parseItinerary(itin, data) {
  const { scheduleDescs, legDescs, baggageAllowanceDescs } = data;
  const pricing = itin.pricingInformation?.[0];
  const fare = pricing?.fare;
  const passengerInfo = fare?.passengerInfoList?.[0]?.passengerInfo;
  const totalFare = fare?.totalFare;
  const paxFare = passengerInfo?.passengerTotalFare;

  // Resolve legs
  const legs = (itin.legs || [])
    .map((l) => parseLeg(byRef(legDescs, l.ref), scheduleDescs))
    .filter(Boolean);

  // Baggage allowance — resolve first allowance ref
  const baggageRef = passengerInfo?.baggageInformation?.[0]?.allowance?.ref;
  const baggage = baggageRef ? byRef(baggageAllowanceDescs, baggageRef) : null;
  const baggageLabel = baggage
    ? (baggage.weight ? `${baggage.weight}kg` : baggage.pieces ? `${baggage.pieces} piece${baggage.pieces > 1 ? "s" : ""}` : null)
    : null;

  return {
    id: itin.id,
    legs,
    currency: totalFare?.currency ?? paxFare?.currency ?? "GBP",
    totalPrice: totalFare?.totalPrice ?? paxFare?.totalFare ?? 0,
    baseFare: paxFare?.baseFareAmount ?? totalFare?.baseFareAmount ?? 0,
    taxes: paxFare?.totalTaxAmount ?? totalFare?.totalTaxAmount ?? 0,
    carrier: fare?.validatingCarrierCode ?? legs[0]?.carrier ?? "—",
    nonRefundable: passengerInfo?.nonRefundable ?? true,
    baggageLabel,
    lastTicketDate: fare?.lastTicketDate,
  };
}

// ── Flight Leg display ────────────────────────────────────────────────────────
function LegRow({ leg }) {
  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Departure */}
      <div className="text-center min-w-[60px]">
        <p className="text-xl font-bold text-gray-900">{leg.departure.time}</p>
        <p className="text-xs font-semibold text-gray-500">{leg.departure.airport}</p>
        {leg.departure.terminal && (
          <p className="text-xs text-gray-400">T{leg.departure.terminal}</p>
        )}
      </div>

      {/* Route line */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <p className="text-xs text-gray-400">{fmtDuration(leg.elapsedTime)}</p>
        <div className="w-full flex items-center gap-1">
          <div className="flex-1 h-px bg-gray-200" />
          <Plane size={12} className="text-gray-400 rotate-90" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-xs text-gray-400">
          {leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Arrival */}
      <div className="text-center min-w-[60px]">
        <p className="text-xl font-bold text-gray-900">{leg.arrival.time}</p>
        <p className="text-xs font-semibold text-gray-500">{leg.arrival.airport}</p>
        {leg.arrival.terminal && (
          <p className="text-xs text-gray-400">T{leg.arrival.terminal}</p>
        )}
      </div>
    </div>
  );
}

// ── Single flight card ────────────────────────────────────────────────────────
function FlightCard({ itin, index, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.6) }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Main row */}
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Carrier badge */}
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{itin.carrier}</span>
          </div>

          {/* Legs */}
          <div className="flex-1 space-y-3 min-w-0">
            {itin.legs.map((leg, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-px bg-dashed border-t border-dashed border-gray-200" />
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Return</span>
                    <div className="flex-1 h-px border-t border-dashed border-gray-200" />
                  </div>
                )}
                <LegRow leg={leg} />
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex-shrink-0 text-right ml-4">
            <p className="text-2xl font-bold text-gray-900">
              {itin.currency} {itin.totalPrice.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {itin.nonRefundable ? "Non-refundable" : "Refundable"}
            </p>
            <button
              onClick={() => onSelect(itin)}
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Select <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {itin.legs[0] && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
              {itin.legs[0].cabin}
            </span>
          )}
          {itin.baggageLabel && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center gap-1">
              <Luggage size={11} /> {itin.baggageLabel} baggage
            </span>
          )}
          {itin.nonRefundable && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center gap-1">
              <AlertCircle size={11} /> Non-refundable
            </span>
          )}
          {itin.lastTicketDate && (
            <span className="text-xs text-gray-400 ml-auto">
              Book by {itin.lastTicketDate}
            </span>
          )}
        </div>
      </div>

      {/* Expandable fare breakdown */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>Fare breakdown</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-2">
                {[
                  ["Base Fare", itin.baseFare],
                  ["Taxes & Fees", itin.taxes],
                ].map(([label, amount]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">
                      {itin.currency} {Number(amount).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {itin.currency} {itin.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Booking confirmation modal ────────────────────────────────────────────────
function BookingModal({ itin, searchParams, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState("confirm"); // confirm | success

  const handleConfirm = () => {
    // Store selection for a booking/payment page
    sessionStorage.setItem("selectedFlight", JSON.stringify({ itin, searchParams }));
    setStep("success");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {step === "success" ? "Flight Reserved" : "Confirm Selection"}
          </h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          {step === "confirm" ? (
            <div className="space-y-5">
              {/* Route summary */}
              {itin.legs.map((leg, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{leg.departure.time}</p>
                    <p className="text-xs text-gray-500">{leg.departure.airport}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-xs text-gray-400">{fmtDuration(leg.elapsedTime)}</p>
                    <div className="w-full flex items-center gap-1 my-1">
                      <div className="flex-1 h-px bg-gray-300" />
                      <Plane size={11} className="text-gray-400 rotate-90" />
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <p className="text-xs text-gray-400">{leg.stops === 0 ? "Direct" : `${leg.stops} stop`}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{leg.arrival.time}</p>
                    <p className="text-xs text-gray-500">{leg.arrival.airport}</p>
                  </div>
                </div>
              ))}

              {/* Price */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-900 text-white">
                <div>
                  <p className="text-sm text-white/60">Total price</p>
                  <p className="text-2xl font-bold">{itin.currency} {itin.totalPrice.toFixed(2)}</p>
                </div>
                <div className="text-right text-xs text-white/50">
                  <p>Base: {itin.currency} {itin.baseFare.toFixed(2)}</p>
                  <p>Tax: {itin.currency} {itin.taxes.toFixed(2)}</p>
                </div>
              </div>

              {itin.nonRefundable && (
                <p className="text-xs text-amber-600 flex items-center gap-1.5 bg-amber-50 rounded-lg px-3 py-2">
                  <AlertCircle size={13} /> This fare is non-refundable
                </p>
              )}

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <Plane size={28} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Flight Selected!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your selection has been saved. Contact us to complete the booking.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-1">
                <p className="text-gray-500">Reference: <span className="font-semibold text-gray-900">#{itin.id}</span></p>
                <p className="text-gray-500">Total: <span className="font-semibold text-gray-900">{itin.currency} {itin.totalPrice.toFixed(2)}</span></p>
                <p className="text-gray-500">Carrier: <span className="font-semibold text-gray-900">{itin.carrier}</span></p>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition">
                  Search Again
                </button>
                <button
                  onClick={() => router.push("/specialQuery")}
                  className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Filter panel ──────────────────────────────────────────────────────────────
function FilterPanel({ itineraries, filters, onChange, onClose }) {
  const maxPrice = Math.max(...itineraries.map((i) => i.totalPrice), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-100 shadow-2xl z-50 overflow-y-auto p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filter Results</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition"><X size={18} /></button>
      </div>

      {/* Direct only */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Direct flights only</label>
        <button onClick={() => onChange({ ...filters, directOnly: !filters.directOnly })}
          className={`h-6 w-11 rounded-full transition-colors ${filters.directOnly ? "bg-gray-900" : "bg-gray-200"}`}>
          <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform mx-0.5 ${filters.directOnly ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Max price */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Max price</label>
          <span className="text-sm font-semibold text-gray-900">GBP {filters.maxPrice ?? Math.ceil(maxPrice)}</span>
        </div>
        <input type="range" min={0} max={Math.ceil(maxPrice)} value={filters.maxPrice ?? Math.ceil(maxPrice)}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gray-900" />
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FlightResultsPage() {
  const router = useRouter();
  const [raw, setRaw] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ directOnly: false, maxPrice: null });
  const [sortBy, setSortBy] = useState("price"); // price | duration

  useEffect(() => {
    const saved = sessionStorage.getItem("flightResults");
    const params = sessionStorage.getItem("flightSearchParams");
    if (saved) setRaw(JSON.parse(saved));
    if (params) setSearchParams(JSON.parse(params));
  }, []);

  // Parse itineraries whenever raw data changes
  useEffect(() => {
    if (!raw?.groupedItineraryResponse) return;
    const data = raw.groupedItineraryResponse;
    const parsed = [];

    for (const group of (data.itineraryGroups || [])) {
      for (const itin of (group.itineraries || [])) {
        try {
          const p = parseItinerary(itin, data);
          if (p.totalPrice > 0) parsed.push(p); // skip itineraries with no price
        } catch (err) {
          console.warn("Failed to parse itinerary", itin.id, err);
        }
      }
    }

    setItineraries(parsed);
    // Set default max price filter to max found
    const max = Math.max(...parsed.map((i) => i.totalPrice), 0);
    setFilters((f) => ({ ...f, maxPrice: Math.ceil(max) }));
  }, [raw]);

  // Apply filters + sort
  const displayed = itineraries
    .filter((i) => {
      if (filters.directOnly && i.legs.some((l) => l.stops > 0)) return false;
      if (filters.maxPrice != null && i.totalPrice > filters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.totalPrice - b.totalPrice;
      if (sortBy === "duration") {
        const aDur = a.legs.reduce((s, l) => s + (l.elapsedTime || 0), 0);
        const bDur = b.legs.reduce((s, l) => s + (l.elapsedTime || 0), 0);
        return aDur - bDur;
      }
      return 0;
    });

  const totalCount = itineraries.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-3">
            <ChevronLeft size={14} /> Back to search
          </button>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {displayed.length} Flight{displayed.length !== 1 ? "s" : ""} Found
              </h1>
              {searchParams && (
                <p className="text-sm text-gray-400 mt-1">
                  {searchParams.origin} → {searchParams.destination}
                  {searchParams.returnDate ? ` · Return` : ` · One Way`}
                  {" · "}{searchParams.departureDate}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-gray-400">
                <option value="price">Sort: Price</option>
                <option value="duration">Sort: Duration</option>
              </select>

              {/* Filter */}
              <button onClick={() => setFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition">
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Empty / loading states */}
        {!raw && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-4">No search results found.</p>
            <button onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-700 transition">
              New Search
            </button>
          </div>
        )}

        {raw && totalCount === 0 && (
          <div className="text-center py-24">
            <Plane size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No flights found</p>
            <p className="text-gray-400 text-sm mb-6">Try different dates or airports</p>
            <button onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-700 transition">
              New Search
            </button>
          </div>
        )}

        {displayed.length === 0 && totalCount > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No flights match your filters.</p>
            <button onClick={() => setFilters({ directOnly: false, maxPrice: null })}
              className="mt-3 text-sm text-gray-900 underline">
              Clear filters
            </button>
          </div>
        )}

        {/* Flight cards */}
        <div className="space-y-4">
          {displayed.map((itin, i) => (
            <FlightCard
              key={itin.id}
              itin={itin}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40" onClick={() => setFilterOpen(false)} />
            <FilterPanel itineraries={itineraries} filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {selected && (
          <BookingModal itin={selected} searchParams={searchParams} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}