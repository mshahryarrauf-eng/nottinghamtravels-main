"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Loader2 } from "lucide-react";

function WhiteSelect({ placeholder, options, value, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !loading && setOpen((v) => !v)}
        className="h-10 w-full px-3 text-left bg-transparent border-b border-gray-200 hover:border-gray-400
                   flex items-center justify-between transition-colors duration-200"
      >
        <span className={selected ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        {loading
          ? <Loader2 size={14} className="text-gray-400 animate-spin" />
          : <ChevronDown size={14} className="text-gray-400" />
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
              className="absolute top-full left-0 mt-2 z-50 w-full min-w-[180px] rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-gray-50 ${
                      value === o.value ? "text-gray-900 font-medium bg-gray-50" : "text-gray-700"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PackageForm() {
  const router = useRouter();

  const [months, setMonths] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [types, setTypes] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/offers/filter")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMonths(data.months.map((m) => ({ value: String(m.number), label: m.name })));
          setDestinations(data.destinations.map((d) => ({ value: d, label: d })));
          setTypes(data.types.map((t) => ({ value: t, label: t })));
        }
      })
      .catch(console.error)
      .finally(() => setFiltersLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!selectedType || !selectedDestination || !selectedMonth) {
      setError("Please select all three filters.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/offers/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, destination: selectedDestination, month: Number(selectedMonth) }),
      });
      const data = await res.json();
      if (data.success && data.offers?.length > 0) {
        sessionStorage.setItem("packages", JSON.stringify(data.offers));
        router.push("/package-details");
      } else {
        setError("No packages found. Try a different destination or month.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div key="packages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {error && (
        <p className="text-center text-red-500 text-sm mb-4 bg-red-50 rounded-lg py-2 px-3">{error}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-5 items-end">
        <WhiteSelect placeholder="Type" options={types} value={selectedType} onChange={setSelectedType} loading={filtersLoading} />
        <WhiteSelect placeholder="Destination" options={destinations} value={selectedDestination} onChange={setSelectedDestination} loading={filtersLoading} />
        <WhiteSelect placeholder="Month" options={months} value={selectedMonth} onChange={setSelectedMonth} loading={filtersLoading} />

        <div className="md:col-span-2 flex justify-end items-end">
          <button
            onClick={handleSearch}
            disabled={loading || filtersLoading}
            className="inline-flex items-center gap-2 rounded-full px-8 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
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
