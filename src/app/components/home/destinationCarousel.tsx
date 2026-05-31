"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { destinationsData } from "@/app/data/destinations"

export default function DestinationsCarousel() {
  const items = [...destinationsData, ...destinationsData]

  return (
    <section className="py-24 bg-white ">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium mb-2">Explore the World</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
            Popular Destinations          
            </h2>
        </motion.div>

      </div>

      {/* Marquee — outside max-w container so it bleeds full width */}
      <div
        className="overflow-hidden"
      >
        <div
          className="flex gap-5 w-max"
          style={{ animation: "dest-marquee 80s linear infinite" }} // ⚡ SPEED: lower = faster, higher = slower
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
        >
          {items.map((dest, i) => (
            <Link key={`${dest.id}-${i}`} href={dest.href || "/destinations"} className="flex-shrink-0" style={{ width: "260px" }}>
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative h-72 w-full bg-gray-100">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1"><MapPin size={10} strokeWidth={2} /><span>{dest.country}</span></div>
                  <h3 className="text-white font-semibold text-lg leading-tight">{dest.name}</h3>
                  <p className="text-white/60 text-xs mt-0.5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{dest.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dest-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}