"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel, MapPin, Star, ChevronLeft, ArrowRight,
  ChevronDown, ChevronUp, SlidersHorizontal, X,
  Utensils, BedDouble, AlertCircle, CheckCircle2,
  Loader2, Shield, RefreshCw, Users,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */

function StarRating({ rating = 0 }) {
  const n = Math.round(Number(rating) || 0);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= n ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </span>
  );
}

function mealLabel(raw) {
  if (!raw) return null;
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function cheapestRoom(rooms = []) {
  if (!rooms.length) return null;
  return rooms.reduce((a, b) => (a.FinalPrice < b.FinalPrice ? a : b));
}

/* ─── Hotel Card ──────────────────────────────────────────── */

function HotelCard({ hotel, index, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const rooms = hotel.Rooms || [];
  const best = cheapestRoom(rooms);
  const imgs = hotel.Images || [];
  const currency = hotel.Currency || "USD";

  // Auto-cycle images
  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setImgIndex((i) => (i + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.6) }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-52 sm:flex-shrink-0 h-44 sm:h-auto overflow-hidden">
          {imgs.length > 0 ? (
            <img
              key={imgIndex}
              src={imgs[imgIndex]}
              alt={hotel.HotelName}
              className="w-full h-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Hotel size={32} className="text-gray-300" />
            </div>
          )}
          {hotel.HotelRating > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <StarRating rating={hotel.HotelRating} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-snug truncate">
                {hotel.HotelName || "Hotel"}
              </h3>
              {hotel.Address && (
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin size={10} /> {hotel.Address}
                </p>
              )}
            </div>

            {best && (
              <div className="flex-shrink-0 text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {currency}{" "}
                  {best.FinalPrice.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">per stay · best room</p>
                <button
                  onClick={() => onSelect(hotel)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  View Rooms <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {best?.MealType && best.MealType !== "No_Meal" && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-1">
                <Utensils size={10} /> {mealLabel(best.MealType)}
              </span>
            )}
            {best?.IsRefundable && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center gap-1">
                <CheckCircle2 size={10} /> Refundable
              </span>
            )}
            {best && !best.IsRefundable && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center gap-1">
                <AlertCircle size={10} /> Non-refundable
              </span>
            )}
            {rooms.length > 1 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500 flex items-center gap-1">
                <BedDouble size={10} /> {rooms.length} room options
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expandable rooms */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>All room options ({rooms.length})</span>
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
                {rooms.map((room, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {room.RoomTypeName || `Room ${i + 1}`}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {room.MealType && room.MealType !== "No_Meal" && (
                          <span className="text-xs text-gray-400">{mealLabel(room.MealType)}</span>
                        )}
                        {room.IsRefundable && (
                          <span className="text-xs text-emerald-600">Refundable</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {currency} {room.FinalPrice?.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => onSelect(hotel, room)}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Room Booking Modal ──────────────────────────────────── */

function BookingModal({ hotel, room, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const roomToBook = room || cheapestRoom(hotel.Rooms || []);

  const handleBook = async () => {
    if (!roomToBook?.BookingCode) {
      setError("No booking code available for this room.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tbo/PreBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BookingCode: roomToBook.BookingCode,
          PaymentMode: "Limit",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.Status?.Description || "Pre-booking failed. Please try again.");
        return;
      }
      sessionStorage.setItem("bookingDetails", JSON.stringify(data));
      setDone(true);
      setTimeout(() => router.push("/booking-details"), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const currency = hotel.Currency || "USD";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{done ? "Booking Initiated" : "Confirm Booking"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{hotel.HotelName}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {done ? (
            <div className="text-center py-6 space-y-5">
              <div className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pre-booking confirmed!</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  Redirecting you to complete your booking details…
                </p>
              </div>
              <Loader2 className="animate-spin h-5 w-5 text-gray-400 mx-auto" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Room summary */}
              <div className="rounded-2xl bg-gray-900 text-white p-5">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Selected Room</p>
                <p className="text-lg font-semibold mb-1">
                  {roomToBook?.RoomTypeName || "Standard Room"}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {currency}{" "}
                  {roomToBook?.FinalPrice?.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="flex gap-4 mt-3 text-xs text-white/40">
                  {roomToBook?.MealType && roomToBook.MealType !== "No_Meal" && (
                    <span>{mealLabel(roomToBook.MealType)}</span>
                  )}
                  <span>{roomToBook?.IsRefundable ? "Refundable" : "Non-refundable"}</span>
                </div>
                {!roomToBook?.IsRefundable && (
                  <p className="mt-3 text-xs text-amber-300 flex items-center gap-1.5">
                    <AlertCircle size={12} /> This rate is non-refundable
                  </p>
                )}
              </div>

              {/* Hotel info */}
              <div className="rounded-xl border border-gray-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hotel</span>
                  <span className="font-medium text-gray-900">{hotel.HotelName}</span>
                </div>
                {hotel.HotelRating > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Rating</span>
                    <StarRating rating={hotel.HotelRating} />
                  </div>
                )}
                {hotel.Address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="text-gray-700 text-right max-w-[60%]">{hotel.Address}</span>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield size={13} className="text-emerald-500" />
                ATOL &amp; ABTA protected booking
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Processing…</>
              ) : (
                <>Proceed to Booking <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Filter Panel ────────────────────────────────────────── */

function FilterPanel({ hotels, filters, onChange, onClose }) {
  const maxPrice = Math.max(
    ...hotels.flatMap((h) => (h.Rooms || []).map((r) => r.FinalPrice || 0)),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-100 shadow-2xl z-50 overflow-y-auto p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
          <X size={18} />
        </button>
      </div>

      {/* Refundable toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Refundable only</label>
        <button
          onClick={() => onChange({ ...filters, refundableOnly: !filters.refundableOnly })}
          className={`h-6 w-11 rounded-full transition-colors ${filters.refundableOnly ? "bg-gray-900" : "bg-gray-200"}`}
        >
          <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform mx-0.5 ${filters.refundableOnly ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Star rating */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Min star rating</label>
          <span className="text-sm font-semibold text-gray-900">
            {filters.minStars > 0 ? `${filters.minStars}★+` : "Any"}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, minStars: s })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filters.minStars === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {s === 0 ? "Any" : `${s}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Meal type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Meal type</label>
        <select
          value={filters.mealType}
          onChange={(e) => onChange({ ...filters, mealType: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-700"
        >
          <option value="All">All</option>
          <option value="BreakFast">Breakfast</option>
          <option value="Half_Board">Half Board</option>
          <option value="Full_Board">Full Board</option>
          <option value="All_Inclusive_All_Meal">All Inclusive</option>
          <option value="Room_Only">Room Only</option>
        </select>
      </div>

      {/* Max price */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Max price</label>
          <span className="text-sm font-semibold text-gray-900">
            {filters.maxPrice ?? Math.ceil(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.ceil(maxPrice)}
          value={filters.maxPrice ?? Math.ceil(maxPrice)}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gray-900"
        />
      </div>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export default function HotelResultsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [selected, setSelected] = useState(null);   // { hotel, room }
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [filters, setFilters] = useState({
    refundableOnly: false,
    minStars: 0,
    mealType: "All",
    maxPrice: null,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("hotelsData");
    const meta  = sessionStorage.getItem("hotelSearchMeta");
    if (saved) {
      const parsed = JSON.parse(saved);
      const arr = parsed?.data || parsed || [];
      setHotels(arr);
      const maxP = Math.max(...arr.flatMap((h) => (h.Rooms || []).map((r) => r.FinalPrice || 0)), 0);
      setFilters((f) => ({ ...f, maxPrice: Math.ceil(maxP) }));
    }
    if (meta) setSearchMeta(JSON.parse(meta));
  }, []);

  const displayed = hotels
    .filter((h) => {
      const rooms = h.Rooms || [];
      if (filters.refundableOnly && !rooms.some((r) => r.IsRefundable)) return false;
      if (filters.minStars > 0 && (h.HotelRating || 0) < filters.minStars) return false;
      if (filters.mealType !== "All" && !rooms.some((r) => r.MealType === filters.mealType)) return false;
      if (filters.maxPrice != null) {
        const minRoomPrice = Math.min(...rooms.map((r) => r.FinalPrice || Infinity));
        if (minRoomPrice > filters.maxPrice) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = cheapestRoom(a.Rooms || [])?.FinalPrice ?? Infinity;
      const priceB = cheapestRoom(b.Rooms || [])?.FinalPrice ?? Infinity;
      if (sortBy === "price") return priceA - priceB;
      if (sortBy === "rating") return (b.HotelRating || 0) - (a.HotelRating || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-3"
          >
            <ChevronLeft size={14} /> Back to search
          </button>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {displayed.length} Hotel{displayed.length !== 1 ? "s" : ""} Found
              </h1>
              {searchMeta && (
                <p className="text-sm text-gray-400 mt-1">
                  {[searchMeta.city, searchMeta.country].filter(Boolean).join(", ")}
                  {searchMeta.checkIn && ` · ${searchMeta.checkIn}`}
                  {searchMeta.checkOut && ` → ${searchMeta.checkOut}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none"
              >
                <option value="price">Cheapest first</option>
                <option value="rating">Highest rated</option>
              </select>
              <button
                onClick={() => setFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Empty states */}
        {hotels.length === 0 && (
          <div className="text-center py-24">
            <Hotel size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No hotel results found</p>
            <p className="text-gray-400 text-sm mb-6">Please go back and search again</p>
            <button
              onClick={() => router.push("/#search-hotels")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-700 transition"
            >
              <RefreshCw size={14} /> New Search
            </button>
          </div>
        )}

        {hotels.length > 0 && displayed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hotels match your filters.</p>
            <button
              onClick={() => setFilters({ refundableOnly: false, minStars: 0, mealType: "All", maxPrice: null })}
              className="mt-3 text-sm text-gray-900 underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Hotel list */}
        <div className="space-y-4">
          {displayed.map((hotel, i) => (
            <HotelCard
              key={hotel.HotelCode || i}
              hotel={hotel}
              index={i}
              onSelect={(h, r) => setSelected({ hotel: h, room: r || null })}
            />
          ))}
        </div>
      </div>

      {/* Filter slide-over */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setFilterOpen(false)}
            />
            <FilterPanel
              hotels={hotels}
              filters={filters}
              onChange={setFilters}
              onClose={() => setFilterOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {selected && (
          <BookingModal
            hotel={selected.hotel}
            room={selected.room}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}