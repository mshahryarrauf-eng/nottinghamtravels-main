"use client"

import { motion } from "framer-motion"
import { airlineData } from "./airlineData"
import { AirlineGrid } from "./airlineGrid"

export function OfferedAirlinesSection() {
  return (
    <section className="py-8 px-6 bg-neutral-50">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4 max-w-2xl mx-auto"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium">
            Global Airline Network
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
            Trusted Airline Partners
          </h2>

          <p className="text-neutral-500 text-lg leading-relaxed">
            We collaborate with world-class airlines to provide seamless,
            comfortable, and reliable journeys across the globe.
          </p>
        </motion.div>

        <AirlineGrid airlines={airlineData} />

      </div>
    </section>
  )
}