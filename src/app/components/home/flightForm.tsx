"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import FormField from "./formField"
import DateField from "./dateField"
import PassengerField from "./passengerField"

interface PassengerCounts {
  adults: number
  teens: number
  kids: number
}

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"]

// Common airlines — user can also type a custom one
const AIRLINES = [
  "Any Airline",
  "British Airways",
  "Emirates",
  "Lufthansa",
  "Qatar Airways",
  "Turkish Airlines",
  "EasyJet",
  "Ryanair",
  "Virgin Atlantic",
  "Air France",
  "KLM",
  "Singapore Airlines",
  "Etihad Airways",
  "Flydubai",
  "Air Arabia",
  "Pakistan International Airlines",
]

export default function FlightForm() {
  const router = useRouter()

  const [tripType, setTripType] = useState<"oneway" | "return">("return")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departureDate, setDepartureDate] = useState<Date | undefined>()
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [cabinClass, setCabinClass] = useState("Economy")
  const [preferredAirline, setPreferredAirline] = useState("Any Airline")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1, teens: 0, kids: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate(): string | null {
    if (!from.trim()) return "Please enter a departure airport (e.g. LHR)."
    if (!to.trim()) return "Please enter a destination airport (e.g. DXB)."
    if (!departureDate) return "Please select a departure date."
    if (tripType === "return" && !returnDate) return "Please select a return date."
    if (!email.trim()) return "Please enter your email address."
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email."
    if (!phone.trim()) return "Please enter your phone number."
    return null
  }

  async function handleSearch() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setLoading(true)

    try {
      const body = {
        tripType: tripType === "return" ? "round" : "oneway",
        origin: from.trim().toUpperCase(),
        destination: to.trim().toUpperCase(),
        departureDate: departureDate!.toISOString().split("T")[0],
        returnDate: tripType === "return" && returnDate
          ? returnDate.toISOString().split("T")[0]
          : undefined,
        passengers: {
          ADT: passengers.adults,
          CHD: passengers.teens + passengers.kids,
          INF: 0,
        },
        cabinClass: cabinClass.toUpperCase().replace(/ /g, "_"),
        preferredAirline: preferredAirline === "Any Airline" ? null : preferredAirline,
        email,
        phone,
      }

      const res = await fetch("/api/flight/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Flight search failed. Please try again.")
      }

      const data = await res.json()
      sessionStorage.setItem("flightResults", JSON.stringify(data))
      sessionStorage.setItem("flightSearchParams", JSON.stringify(body))
      router.push("/bookings/flights")
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // Shared select style
  const selectCls = `h-10 w-full px-3 bg-transparent border-b border-gray-200
    focus:outline-none focus:border-gray-900 transition-colors duration-200
    appearance-none cursor-pointer font-bold text-gray-900`

  return (
    <motion.div
      key="flights"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trip type toggle */}
      <div className="flex justify-center gap-8 mb-6 relative">
        {(["oneway", "return"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`relative pb-2 text-sm uppercase tracking-wider transition-colors duration-200 ${
              tripType === type
                ? "text-gray-900 font-semibold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {type === "oneway" ? "One Way" : "Return"}
            {tripType === type && (
              <motion.div
                layoutId="tripUnderline"
                className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gray-900"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 text-sm mb-4 bg-red-50 rounded-lg py-2 px-3">
          {error}
        </p>
      )}

      {/* Row 1: From / To / Departure / Return / Passengers / Class */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-5 items-end">
        <FormField
          placeholder="e.g. LHR"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          label="From"
        />
        <FormField
          placeholder="e.g. DXB"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          label="To"
        />

        <DateField
          value={departureDate}
          onSelect={setDepartureDate}
          placeholder="Select date"
          label="Departure"
        />

        <motion.div
          animate={{ opacity: tripType === "return" ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
          className={tripType === "oneway" ? "pointer-events-none" : ""}
        >
          <DateField
            value={returnDate}
            onSelect={setReturnDate}
            placeholder="Select date"
            disabled={tripType === "oneway"}
            disableBefore={departureDate}
            label="Return"
          />
        </motion.div>

        <PassengerField onPassengersChange={setPassengers} />

        {/* Class */}
        <div className="relative w-full">
          <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">Class</label>
          <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className={selectCls}>
            {CABIN_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="absolute right-2 bottom-2.5 h-4 w-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Row 2: Email / Phone / Preferred Airline / Search */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 items-end mt-5">
        <FormField
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
        />
        <FormField
          type="tel"
          placeholder="+44 7700 000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          label="Phone Number"
        />

        {/* ✅ Preferred Airline */}
        <div className="relative w-full">
          <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">Preferred Airline</label>
          <select
            value={preferredAirline}
            onChange={(e) => setPreferredAirline(e.target.value)}
            className={selectCls}
          >
            {AIRLINES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <svg className="absolute right-2 bottom-2.5 h-4 w-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex justify-end items-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full px-8 py-2.5
                       bg-gray-900 text-white text-sm font-medium
                       hover:bg-gray-700 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search size={14} />
                Search Flights
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
