"use client"

import { motion } from "framer-motion"
import DestinationGrid from "@/app/components/destinations/destinationGrid"

export default function DestinationsPage() {
  return (
    <main className="bg-white text-neutral-900">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight"
          >
            Explore the World
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-neutral-500 max-w-2xl mx-auto text-lg"
          >
            Handpicked destinations designed to inspire your next journey —
            where luxury meets unforgettable experiences.
          </motion.p>

        </div>
      </section>

      {/* Grid Section */}
      <DestinationGrid />

    </main>
  )
}