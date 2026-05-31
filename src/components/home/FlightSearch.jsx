// "use client";
// import { useState } from "react";

// const FlightSearch = () => {
//   const [tripType, setTripType] = useState("round");
//   const [origin, setOrigin] = useState("MIA");
//   const [destination, setDestination] = useState("MCO");
//   const [departureDate, setDepartureDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [showPassengerBox, setShowPassengerBox] = useState(false);

//   const [passengers, setPassengers] = useState({
//     adults: 1,
//     children: 0,
//     infants: 0,
//   });

//   const [cabinClass, setCabinClass] = useState("ECONOMY");

//   const totalPassengers =
//     passengers.adults + passengers.children + passengers.infants;

//   const updatePassenger = (type, delta) => {
//     setPassengers((prev) => {
//       const next = prev[type] + delta;

//       if (type === "adults" && next < 1) return prev;
//       if (next < 0) return prev;

//       if (type === "infants" && next > prev.adults) return prev;

//       const total = prev.adults + prev.children + prev.infants + delta;

//       if (total > 9) return prev;

//       return { ...prev, [type]: next };
//     });
//   };

//   const passengerSummary = () => {
//     const parts = [];

//     if (passengers.adults > 0) {
//       parts.push(
//         `${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}`
//       );
//     }

//     if (passengers.children > 0) {
//       parts.push(
//         `${passengers.children} Child${passengers.children > 1 ? "ren" : ""}`
//       );
//     }

//     if (passengers.infants > 0) {
//       parts.push(
//         `${passengers.infants} Infant${passengers.infants > 1 ? "s" : ""}`
//       );
//     }

//     return parts.join(", ");
//   };

//   const handleSearch = async () => {
//     if (!departureDate || (tripType === "round" && !returnDate)) {
//       alert("Please select required dates");
//       return;
//     }

//     setLoading(true);
//     try {
//       await fetch("/api/flight/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           tripType,
//           origin,
//           destination,
//           departureDate,
//           returnDate: tripType === "round" ? returnDate : null,
//           passengers: {
//             ADT: passengers.adults,
//             CHD: passengers.children,
//             INF: passengers.infants,
//           },
//           cabinClass,
//         }),
//       });
//     } catch (err) {
//       alert("Flight search failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-xl max-w-6xl mx-auto mt-10">
//       {/* Trip Type */}
//       <div className="flex gap-4 justify-center mb-6">
//         {["oneway", "round"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setTripType(type)}
//             className={`px-4 py-2 rounded font-semibold ${
//               tripType === type ? "bg-[#23AFEC] text-white" : "bg-gray-200"
//             }`}
//           >
//             {type === "oneway" ? "One-Way" : "Round-Trip"}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Origin */}
//         <input
//           value={origin}
//           onChange={(e) => setOrigin(e.target.value.toUpperCase())}
//           placeholder="Origin"
//           className="border px-4 py-2 rounded"
//         />

//         {/* Destination */}
//         <input
//           value={destination}
//           onChange={(e) => setDestination(e.target.value.toUpperCase())}
//           placeholder="Destination"
//           className="border px-4 py-2 rounded"
//         />

//         {/* Departure */}
//         <input
//           type="date"
//           value={departureDate}
//           onChange={(e) => setDepartureDate(e.target.value)}
//           className="border px-4 py-2 rounded"
//         />

//         {/* Return */}
//         {tripType === "round" && (
//           <input
//             type="date"
//             value={returnDate}
//             onChange={(e) => setReturnDate(e.target.value)}
//             className="border px-4 py-2 rounded"
//           />
//         )}

//         {/* Passenger Selector */}
//         <div className="relative sm:col-span-2">
//           <button
//             onClick={() => setShowPassengerBox(!showPassengerBox)}
//             className="w-full border px-4 py-3 rounded flex justify-between"
//           >
//             <span>
//               {passengerSummary()} ·{" "}
//               {cabinClass.charAt(0) + cabinClass.slice(1).toLowerCase()}
//             </span>

//             <span>▼</span>
//           </button>

//           {showPassengerBox && (
//             <div className="absolute z-20 bg-white w-full border rounded-lg shadow-xl mt-2 p-4">
//               <p className="text-sm text-gray-500 mb-3">
//                 Please select the exact number of passengers
//               </p>

//               {[
//                 { label: "Adults", sub: "12+ years old", key: "adults" },
//                 { label: "Children", sub: "2–11 years old", key: "children" },
//                 { label: "Infants on lap", sub: "Under 2 years old", key: "infants" },
//               ].map((p) => (
//                 <div
//                   key={p.key}
//                   className="flex justify-between items-center py-3"
//                 >
//                   <div>
//                     <p className="font-semibold">{p.label}</p>
//                     <p className="text-xs text-gray-500">{p.sub}</p>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => updatePassenger(p.key, -1)}
//                       className="w-8 h-8 border rounded-full"
//                     >
//                       −
//                     </button>
//                     <span>{passengers[p.key]}</span>
//                     <button
//                       onClick={() => updatePassenger(p.key, 1)}
//                       className="w-8 h-8 border rounded-full text-blue-600"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               {/* Cabin */}
//               <select
//                 value={cabinClass}
//                 onChange={(e) => setCabinClass(e.target.value)}
//                 className="w-full border rounded px-4 py-2 mt-3"
//               >
//                 <option value="ECONOMY">Economy</option>
//                 <option value="PREMIUM_ECONOMY">Premium Economy</option>
//                 <option value="BUSINESS">Business</option>
//                 <option value="FIRST">First</option>
//               </select>

//               <button
//                 onClick={() => setShowPassengerBox(false)}
//                 className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-semibold"
//               >
//                 Done
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Search */}
//       <button
//         onClick={handleSearch}
//         disabled={loading}
//         className="mt-6 w-full bg-[#23AFEC] text-white py-3 rounded-lg font-semibold"
//       >
//         {loading ? "Searching..." : "Search Flights"}
//       </button>
//     </div>
//   );
// };

// export default FlightSearch;



"use client";
import { useState } from "react";

// ─── Cabin map (matches sabreSearch.js) ───────────────────────────────────────
const cabinMap = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "Premium Economy",
  BUSINESS: "Business",
  FIRST: "First",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

// ─── Parse Sabre grouped itinerary response ───────────────────────────────────
function parseSabreResponse(data) {
  try {
    const gir = data?.groupedItineraryResponse;
    if (!gir) return [];

    const scheduleMap = {};
    (gir.scheduleDescs || []).forEach((s) => {
      scheduleMap[s.id] = s;
    });

    const legMap = {};
    (gir.legDescs || []).forEach((leg) => {
      legMap[leg.id] = leg;
    });

    const itineraries = [];

    (gir.itineraryGroups || []).forEach((group) => {
      const groupKey = group.groupDescription?.legDescriptions?.[0];
      (group.itineraries || []).forEach((itin) => {
        const pricing = itin.pricingInformation?.[0];
        const fare = pricing?.fare;
        const totalPrice =
          fare?.totalFare?.totalPrice || fare?.totalFare?.equivalentAmount;
        const currency = fare?.totalFare?.currency || "USD";
        const baseFare = fare?.passengerInfoList?.[0]?.passengerInfo?.passengerTotalFare?.baseFare;

        const legs = (itin.legs || []).map((legRef) => {
          const legDesc = legMap[legRef.ref];
          const schedules = (legDesc?.schedules || []).map((schRef) => {
            const sch = scheduleMap[schRef.ref];
            return {
              carrier: sch?.carrier?.marketing || sch?.carrier?.operating || "",
              flightNum: sch?.carrier?.marketingFlightNumber || "",
              from: sch?.departure?.airport || "",
              to: sch?.arrival?.airport || "",
              depTime: sch?.departure?.time || "",
              arrTime: sch?.arrival?.time || "",
              depDate: groupKey?.departureDate || "",
              duration: sch?.elapsedTime || null,
              stops: (legDesc?.schedules?.length || 1) - 1,
            };
          });
          return {
            elapsedTime: legDesc?.elapsedTime || null,
            schedules,
          };
        });

        itineraries.push({
          id: `${itin.id || Math.random()}`,
          totalPrice,
          currency,
          baseFare,
          legs,
        });
      });
    });

    return itineraries;
  } catch (e) {
    console.error("Parse error:", e);
    return [];
  }
}

// ─── Flight Card ──────────────────────────────────────────────────────────────
function FlightCard({ flight, passengers }) {
  const [expanded, setExpanded] = useState(false);
  const leg = flight.legs?.[0];
  const firstSeg = leg?.schedules?.[0];
  const lastSeg = leg?.schedules?.[leg.schedules.length - 1];
  const stops = (leg?.schedules?.length || 1) - 1;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Airline */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="w-10 h-10 bg-[#e8f6fd] rounded-full flex items-center justify-center">
              <span className="text-[#23AFEC] font-bold text-sm">
                {firstSeg?.carrier || "??"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {firstSeg?.carrier} {firstSeg?.flightNum}
              </p>
              <p className="text-xs text-gray-400">
                {cabinMap[passengers?.cabinClass] || "Economy"}
              </p>
            </div>
          </div>

          {/* Route & Times */}
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {firstSeg?.depTime?.slice(0, 5) || "--:--"}
              </p>
              <p className="text-sm font-semibold text-gray-500">
                {firstSeg?.from}
              </p>
              {firstSeg?.depDate && (
                <p className="text-xs text-gray-400">
                  {formatDate(firstSeg.depDate)}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <p className="text-xs text-gray-400">
                {leg?.elapsedTime ? formatDuration(leg.elapsedTime) : ""}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-[#23AFEC]" />
                <div className="w-16 sm:w-24 h-px bg-gray-300 relative">
                  {stops > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full" />
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#23AFEC]" />
              </div>
              <p className={`text-xs font-medium ${stops === 0 ? "text-green-500" : "text-orange-500"}`}>
                {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {lastSeg?.arrTime?.slice(0, 5) || "--:--"}
              </p>
              <p className="text-sm font-semibold text-gray-500">
                {lastSeg?.to}
              </p>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="text-right min-w-[120px]">
            <p className="text-xs text-gray-400 mb-1">from</p>
            <p className="text-2xl font-bold text-[#23AFEC]">
              {flight.currency === "USD" ? "$" : flight.currency}{" "}
              {flight.totalPrice?.toFixed(2) || "N/A"}
            </p>
            <p className="text-xs text-gray-400 mb-2">per person</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-[#23AFEC] hover:bg-[#1a9fd4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {expanded ? "Hide" : "Select"}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Flight Details
          </p>
          {leg?.schedules?.map((seg, i) => (
            <div key={i} className="flex items-start gap-4 mb-3 last:mb-0">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full bg-[#23AFEC]" />
                {i < leg.schedules.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 my-1" />
                )}
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">From</p>
                  <p className="font-semibold">{seg.from}</p>
                  <p className="text-gray-600">{seg.depTime?.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">To</p>
                  <p className="font-semibold">{seg.to}</p>
                  <p className="text-gray-600">{seg.arrTime?.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Flight</p>
                  <p className="font-semibold">{seg.carrier} {seg.flightNum}</p>
                </div>
                {seg.duration && (
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-semibold">{formatDuration(seg.duration)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Fare breakdown */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {flight.baseFare && (
                <span>Base fare: <span className="font-medium text-gray-700">{flight.currency} {flight.baseFare?.toFixed(2)}</span></span>
              )}
            </div>
            <button className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors">
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results Section ──────────────────────────────────────────────────────────
function FlightResults({ results, loading, searched, searchParams }) {
  if (!searched) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-2 w-14 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex gap-4 items-center flex-1 justify-center">
                <div className="h-8 w-16 bg-gray-200 rounded" />
                <div className="h-2 w-24 bg-gray-100 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">✈️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No flights found
          </h3>
          <p className="text-gray-400 text-sm">
            Try different dates, routes, or cabin class.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {/* Results header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {searchParams?.origin} → {searchParams?.destination}
          </h2>
          <p className="text-sm text-gray-400">
            {results.length} flight{results.length !== 1 ? "s" : ""} found ·{" "}
            {searchParams?.departureDate}
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Sorted by price
        </div>
      </div>

      <div className="space-y-3">
        {results
          .sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0))
          .map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              passengers={searchParams}
            />
          ))}
      </div>
    </div>
  );
}

// ─── Main FlightSearch Component ──────────────────────────────────────────────
const FlightSearch = () => {
  const [tripType, setTripType] = useState("round");
  const [origin, setOrigin] = useState("MIA");
  const [destination, setDestination] = useState("MCO");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassengerBox, setShowPassengerBox] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState("ECONOMY");

  // Results state
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const updatePassenger = (type, delta) => {
    setPassengers((prev) => {
      const next = prev[type] + delta;
      if (type === "adults" && next < 1) return prev;
      if (next < 0) return prev;
      if (type === "infants" && next > prev.adults) return prev;
      const total = prev.adults + prev.children + prev.infants + delta;
      if (total > 9) return prev;
      return { ...prev, [type]: next };
    });
  };

  const passengerSummary = () => {
    const parts = [];
    if (passengers.adults > 0)
      parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? "s" : ""}`);
    if (passengers.children > 0)
      parts.push(`${passengers.children} Child${passengers.children > 1 ? "ren" : ""}`);
    if (passengers.infants > 0)
      parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const handleSearch = async () => {
    if (!departureDate || (tripType === "round" && !returnDate)) {
      alert("Please select required dates");
      return;
    }

    setLoading(true);
    setSearched(true);
    setResults([]);

    const payload = {
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === "round" ? returnDate : null,
      passengers: {
        ADT: passengers.adults,
        CHD: passengers.children,
        INF: passengers.infants,
      },
      cabinClass,
    };

    setSearchParams({ ...payload, origin, destination });

    try {
      const res = await fetch("/api/flight/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const parsed = parseSabreResponse(data);
      setResults(parsed);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Search Form ── */}
      <div className="p-6 bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
        {/* Trip Type */}
        <div className="flex gap-4 justify-center mb-6">
          {["oneway", "round"].map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                tripType === type
                  ? "bg-[#23AFEC] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "oneway" ? "One-Way" : "Round-Trip"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Origin */}
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="Origin (e.g. JFK)"
            className="border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23AFEC] text-sm"
          />

          {/* Destination */}
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="Destination (e.g. LAX)"
            className="border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23AFEC] text-sm"
          />

          {/* Departure */}
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23AFEC] text-sm"
          />

          {/* Return */}
          {tripType === "round" ? (
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23AFEC] text-sm"
            />
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Passenger Selector */}
          <div className="relative sm:col-span-2">
            <button
              onClick={() => setShowPassengerBox(!showPassengerBox)}
              className="w-full border border-gray-200 px-4 py-3 rounded-lg flex justify-between items-center text-sm focus:outline-none focus:ring-2 focus:ring-[#23AFEC]"
            >
              <span className="text-gray-700">
                {passengerSummary()} ·{" "}
                {cabinClass.charAt(0) + cabinClass.slice(1).toLowerCase().replace("_", " ")}
              </span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>

            {showPassengerBox && (
              <div className="absolute z-20 bg-white w-full border border-gray-100 rounded-xl shadow-2xl mt-2 p-4">
                <p className="text-sm text-gray-400 mb-3">
                  Select passengers (max 9)
                </p>

                {[
                  { label: "Adults", sub: "12+ years", key: "adults" },
                  { label: "Children", sub: "2–11 years", key: "children" },
                  { label: "Infants on lap", sub: "Under 2 years", key: "infants" },
                ].map((p) => (
                  <div
                    key={p.key}
                    className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{p.label}</p>
                      <p className="text-xs text-gray-400">{p.sub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassenger(p.key, -1)}
                        className="w-8 h-8 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-4 text-center font-semibold text-sm">
                        {passengers[p.key]}
                      </span>
                      <button
                        onClick={() => updatePassenger(p.key, 1)}
                        className="w-8 h-8 border border-[#23AFEC] rounded-full text-[#23AFEC] hover:bg-[#e8f6fd] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#23AFEC]"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>

                <button
                  onClick={() => setShowPassengerBox(false)}
                  className="mt-4 w-full bg-[#23AFEC] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1a9fd4] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-5 w-full bg-[#23AFEC] hover:bg-[#1a9fd4] disabled:opacity-60 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Searching flights...
            </span>
          ) : (
            "Search Flights ✈"
          )}
        </button>
      </div>

      {/* ── Results ── */}
      <FlightResults
        results={results}
        loading={loading}
        searched={searched}
        searchParams={searchParams}
      />
    </div>
  );
};

export default FlightSearch;