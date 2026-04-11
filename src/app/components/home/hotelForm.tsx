"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, Search, X, AlertCircle } from "lucide-react";
import DateField from "./dateField";
import HotelGuestField from "./hotelGuestField";

// ── Searchable dropdown — dark text on white ───────────────────────────────────
function SearchableSelect({ placeholder, options, value, onChange, loading, disabled = false, error = undefined }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => { if (!disabled && !loading) setOpen((v) => !v); }}
        className={`h-10 w-full px-3 text-left bg-transparent border-b flex items-center justify-between
          transition-colors duration-200
          ${error ? "border-red-400" : "border-gray-200 hover:border-gray-400"}
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <span className={selected ? "text-gray-900 text-sm truncate" : "text-gray-400 text-sm"}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        {loading
          ? <Loader2 size={14} className="text-gray-400 animate-spin flex-shrink-0" />
          : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
        }
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 w-full min-w-[220px] rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-gray-100">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full text-gray-900 text-sm outline-none placeholder:text-gray-400 px-2 py-1"
                />
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-4">No results</p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { onChange(o.value); setOpen(false); setQuery(""); }}
                      className={`w-full text-left px-3 py-2.5 text-sm transition hover:bg-gray-50 ${
                        value === o.value ? "text-gray-900 font-medium bg-gray-50" : "text-gray-700"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Hotel multi-select — dark text on white ────────────────────────────────────
function HotelMultiSelect({ options, value, onChange, loading, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );
  const toggle = (code) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);

  const label = value.length === 0
    ? "Any hotel (optional)"
    : `${value.length} hotel${value.length > 1 ? "s" : ""} selected`;

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => { if (!disabled && !loading) setOpen((v) => !v); }}
        className="h-10 w-full px-3 text-left bg-transparent border-b border-gray-200 hover:border-gray-400
                   flex items-center justify-between transition-colors duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className={value.length > 0 ? "text-gray-900 text-sm truncate" : "text-gray-400 text-sm"}>
          {loading ? "Loading hotels…" : label}
        </span>
        {loading
          ? <Loader2 size={14} className="text-gray-400 animate-spin flex-shrink-0" />
          : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 w-full min-w-[260px] rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hotels…"
                  className="flex-1 text-gray-900 text-sm outline-none placeholder:text-gray-400 px-2 py-1"
                />
                {value.length > 0 && (
                  <button type="button" onClick={() => onChange([])} className="text-gray-400 hover:text-gray-700 text-xs transition">
                    Clear
                  </button>
                )}
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-4">No hotels found</p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggle(o.value)}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition"
                    >
                      <div className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        value.includes(o.value) ? "bg-gray-900 border-gray-900" : "border-gray-300"
                      }`}>
                        {value.includes(o.value) && (
                          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 truncate">{o.label}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gray-100">
                <button type="button" onClick={() => setOpen(false)}
                  className="w-full py-1.5 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium transition">
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Guest + room picker — dark text on white ───────────────────────────────────
function GuestRoomPicker({ paxRooms, onChange }) {
  const [open, setOpen] = useState(false);
  const total = paxRooms.reduce((s, r) => s + r.Adults + r.Children, 0);
  const summary = `${total} Guest${total > 1 ? "s" : ""}, ${paxRooms.length} Room${paxRooms.length > 1 ? "s" : ""}`;

  const update = (ri, field, val) => {
    const next = paxRooms.map((r, i) => {
      if (i !== ri) return r;
      const updated = { ...r, [field]: val };
      if (field === "Children") {
        const ages = [...updated.ChildrenAges];
        while (ages.length < val) ages.push(5);
        while (ages.length > val) ages.pop();
        updated.ChildrenAges = ages;
      }
      return updated;
    });
    onChange(next);
  };

  return (
    <div className="relative w-full">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="h-10 w-full px-3 text-left bg-transparent border-b border-gray-200 hover:border-gray-400
                   flex items-center justify-between transition-colors duration-200">
        <span className="text-gray-900 text-sm">{summary}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute top-full left-0 mt-2 z-50 w-72 rounded-xl bg-white border border-gray-200 shadow-xl p-4 space-y-4"
            >
              {paxRooms.map((room, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 text-sm font-medium">Room {i + 1}</span>
                    {i > 0 && (
                      <button type="button" onClick={() => onChange(paxRooms.filter((_, idx) => idx !== i))}
                        className="text-gray-400 hover:text-red-500 transition"><X size={14} /></button>
                    )}
                  </div>
                  {[
                    { label: "Adults (18+)", field: "Adults", min: 1, max: 8 },
                    { label: "Children (0–17)", field: "Children", min: 0, max: 6 },
                  ].map(({ label, field, min, max }) => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">{label}</span>
                      <div className="flex items-center gap-2">
                        <button type="button"
                          onClick={() => update(i, field, Math.max(min, room[field] - 1))}
                          disabled={room[field] <= min}
                          className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30">−</button>
                        <span className="text-gray-900 text-sm w-4 text-center">{room[field]}</span>
                        <button type="button"
                          onClick={() => update(i, field, Math.min(max, room[field] + 1))}
                          disabled={room[field] >= max}
                          className="h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30">+</button>
                      </div>
                    </div>
                  ))}
                  {room.Children > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-gray-500 text-xs">Child ages:</p>
                      {room.ChildrenAges.map((age, ci) => (
                        <div key={ci} className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">Child {ci + 1}</span>
                          <select value={age} onChange={(e) => {
                            const ages = [...room.ChildrenAges]; ages[ci] = Number(e.target.value);
                            update(i, "ChildrenAges", ages);
                          }} className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-900">
                            {[...Array(18).keys()].map((a) => (
                              <option key={a} value={a}>{a === 0 ? "< 1 yr" : `${a} yr${a > 1 ? "s" : ""}`}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                  {i < paxRooms.length - 1 && <div className="border-t border-gray-100" />}
                </div>
              ))}
              <button type="button"
                onClick={() => onChange([...paxRooms, { Adults: 1, Children: 0, ChildrenAges: [] }])}
                className="w-full py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs hover:bg-gray-50 transition">
                + Add Room
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="w-full py-1.5 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium transition">
                Done
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main HotelForm ─────────────────────────────────────────────────────────────
export default function HotelForm() {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [countryError, setCountryError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState([]);

  const [checkin, setCheckin] = useState(undefined);
  const [checkout, setCheckout] = useState(undefined);
  const [nationality, setNationality] = useState("");
  const [paxRooms, setPaxRooms] = useState([{ Adults: 2, Children: 0, ChildrenAges: [] }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCountryLoading(true);
    setCountryError(null);
    fetch("/api/tbo/countryList")
      .then(async (res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => {
        const list = data?.CountryList || data?.countryList || [];
        if (!list.length) { setCountryError("No countries returned from TBO"); return; }
        setCountries(list.map((c) => ({ value: c.Code, label: c.Name })));
      })
      .catch((err) => setCountryError("Could not load countries. Check your TBO credentials."))
      .finally(() => setCountryLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCountry) { setCities([]); setSelectedCity(""); setHotels([]); setSelectedHotels([]); return; }
    setCityLoading(true);
    fetch("/api/tbo/citiesByCountry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ CountryCode: selectedCountry }) })
      .then((r) => r.json())
      .then((data) => setCities((data?.CityList || []).map((c) => ({ value: c.Code, label: c.Name }))))
      .catch(console.error)
      .finally(() => setCityLoading(false));
    setSelectedCity(""); setHotels([]); setSelectedHotels([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCity) { setHotels([]); setSelectedHotels([]); return; }
    setHotelLoading(true);
    fetch("/api/tbo/hotelsListByCity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ CityCode: selectedCity, IsDetailedResponse: false }) })
      .then((r) => r.json())
      .then((data) => setHotels((data?.Hotels || []).map((h) => ({ value: h.HotelCode, label: h.HotelName }))))
      .catch(console.error)
      .finally(() => setHotelLoading(false));
    setSelectedHotels([]);
  }, [selectedCity]);

  const validate = () => {
    if (!selectedCountry) return "Please select a country.";
    if (!selectedCity) return "Please select a city.";
    if (!checkin) return "Please select a check-in date.";
    if (!checkout) return "Please select a check-out date.";
    if (!nationality.trim()) return "Please enter your nationality (2-letter code e.g. GB).";
    return null;
  };

  const handleSearch = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null); setLoading(true);
    try {
      const body = {
        CheckIn: checkin.toISOString().split("T")[0],
        CheckOut: checkout.toISOString().split("T")[0],
        CityCode: selectedCity,
        GuestNationality: nationality.trim().toUpperCase().slice(0, 2),
        PaxRooms: paxRooms,
        IsDetailedResponse: true,
        Filters: { Refundable: false, NoOfRooms: paxRooms.length, MealType: "All" },
        ...(selectedHotels.length > 0 && { HotelCodes: selectedHotels.join(",") }),
      };
      const res = await fetch("/api/tbo/searchQuery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Search failed");
      sessionStorage.setItem("hotelsData", JSON.stringify(data));
      sessionStorage.setItem("hotelSearchParams", JSON.stringify({ country: selectedCountry, city: selectedCity, checkin: body.CheckIn, checkout: body.CheckOut, paxRooms, nationality }));
      router.push("/bookings/hotels");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div key="hotels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {countryError && (
        <div className="flex items-center gap-2 text-red-600 text-xs mb-4 bg-red-50 rounded-lg px-3 py-2">
          <AlertCircle size={13} /> {countryError}
        </div>
      )}
      {error && <p className="text-center text-red-500 text-sm mb-4 bg-red-50 rounded-lg py-2 px-3">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 items-end">
        <SearchableSelect placeholder="Country" options={countries} value={selectedCountry} onChange={setSelectedCountry} loading={countryLoading} error={countryError ? "Failed to load" : undefined} />
        <SearchableSelect placeholder="City" options={cities} value={selectedCity} onChange={setSelectedCity} loading={cityLoading} disabled={!selectedCountry || countryLoading} />
        <HotelMultiSelect options={hotels} value={selectedHotels} onChange={setSelectedHotels} loading={hotelLoading} disabled={!selectedCity} />

        {/* Nationality */}
        <div className="relative w-full">
          <input value={nationality} onChange={(e) => setNationality(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="Nationality (e.g. GB)" maxLength={2}
            className="h-10 w-full px-3 text-gray-900 placeholder:text-gray-400 bg-transparent outline-none border-b border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-colors uppercase tracking-widest" />
        </div>

        <DateField value={checkin} onSelect={setCheckin} placeholder="Check-in" label="Check-in" />
        <DateField value={checkout} onSelect={setCheckout} placeholder="Check-out" disableBefore={checkin} label="Check-out" />
        <GuestRoomPicker paxRooms={paxRooms} onChange={setPaxRooms} />

        <div className="flex justify-end items-end">
          <button onClick={handleSearch} disabled={loading || countryLoading}
            className="inline-flex items-center gap-2 rounded-full px-8 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Searching…</>
              : <><Search size={14} /> Search</>
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
}
