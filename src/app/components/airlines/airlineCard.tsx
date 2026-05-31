"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Airline } from "./airlineData"

interface AirlineCardProps {
  airline: Airline
  index: number
}

export function AirlineCard({ airline, index }: AirlineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative bg-white flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden"
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition duration-300" />

      {/* Logo */}
      <div className="relative z-10 h-14 flex items-center justify-center mb-6">
        <Image
          src={airline.logo}
          alt={airline.name}
          width={200}
          height={200}
          className="object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
        />
      </div>

      {/* Text */}
      {/* <div className="relative z-10 space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
          {airline.name}
        </h3>
        <p className="text-xs text-neutral-500">
          {airline.country}
        </p>
      </div> */}

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-neutral-900 group-hover:w-full transition-all duration-500" />
    </motion.div>
  )
}