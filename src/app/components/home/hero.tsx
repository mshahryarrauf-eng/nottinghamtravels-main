"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Hotel, Package } from "lucide-react"
import FlightForm from "./flightForm"
import HotelForm from "./hotelForm"
import PackageForm from "./packageForm"

type SearchType = "flights" | "hotels" | "packages"

const TABS: { key: SearchType; label: string; icon: React.ElementType }[] = [
  { key: "flights", label: "Flights", icon: Plane },
  { key: "hotels", label: "Hotels", icon: Hotel },
  { key: "packages", label: "Packages", icon: Package },
]

export default function Hero() {
  const [searchType, setSearchType] = useState<SearchType>("flights")

  // ✅ HANDLE HASH (this is the key fix)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "")

      if (hash === "search-flights") setSearchType("flights")
      if (hash === "search-hotels") setSearchType("hotels")
      if (hash === "search-packages") setSearchType("packages")

      if (hash.startsWith("search-")) {
        const section = document.getElementById("search-section")
        if (section) {
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }
      }
    }

    // Run once on load
    applyHash()

    // Listen for changes
    window.addEventListener("hashchange", applyHash)

    return () => {
      window.removeEventListener("hashchange", applyHash)
    }
  }, [])

  return (
    <section
      id="search-section"
      className="relative min-h-screen w-full flex flex-col"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <Image
          src="/bg.jpg"
          alt="Luxury travel"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-10">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
            Plan Your Perfect Trip
          </h1>

        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-6xl"
        >
          {/* Tabs */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full px-2 py-1 flex gap-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  id={`tab-${key}`} // (optional now, but fine to keep)
                  onClick={() => setSearchType(key)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition
                    ${
                      searchType === key
                        ? "bg-green-500 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-transparent">
            <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <AnimatePresence mode="wait">
                {searchType === "flights" && (
                  <motion.div
                    key="flights"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FlightForm />
                  </motion.div>
                )}

                {searchType === "hotels" && (
                  <motion.div
                    key="hotels"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HotelForm />
                  </motion.div>
                )}

                {searchType === "packages" && (
                  <motion.div
                    key="packages"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PackageForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-6 mt-8 flex-wrap justify-center"
        >
          {[
            "ATOL Protected",
            "ABTA Member",
            "24/7 Support",
            "Best Price Guarantee",
          ].map((badge) => (
            <span
              key={badge}
              className="text-white text-xs font-medium flex items-center gap-1.5"
            >
              <span className="h-1 w-1 rounded-full bg-white/40" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}