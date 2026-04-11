"use client"

// ─────────────────────────────────────────────
//  components/customQuery/customQueryHero.tsx
// ─────────────────────────────────────────────

import Image from "next/image"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

export default function CustomQueryHero() {
  return (
    <section className="relative h-[55vh] min-h-105 w-full overflow-hidden">

      {/* Background — swap /custom-query/hero-bg.jpg with your image */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <Image
          src="/bg.jpg"
          alt="Custom travel query"
          fill
          priority
          className="object-cover"
        />
        {/* Same overlay as hero.tsx */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto flex h-full items-center justify-center px-6">
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-5">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
          >
            <MessageSquare size={14} strokeWidth={2} />
            Personalised Travel
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight"
          >
            Plan Your Perfect
            <span className="block font-light italic">
              Custom Journey
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-white/75 text-lg max-w-xl leading-relaxed"
          >
            Tell us where you want to go and we'll handle everything —
            flights, hotels, visas, and more, tailored just for you.
          </motion.p>

        </div>
      </div>

    </section>
  )
}