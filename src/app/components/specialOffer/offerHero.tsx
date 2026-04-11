"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Tag, ArrowDown } from "lucide-react"

export default function OfferHero() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax motion
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* 🔥 Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src="/offer-bg.jpg"
          alt="Special travel offers"
          fill
          priority
          className="object-cover"
        />

        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* 🔥 Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto text-white"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-xs uppercase tracking-widest mb-6"
        >
          <Tag size={14} />
          Limited-Time Deals
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-6"
        >
          Offers and Deals
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
        >
          Discover exclusive offers on flights, hotels, and complete holiday
          packages — carefully selected to give you the best value.
        </motion.p>

        {/* 🔥 Trust / Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 mt-10 flex-wrap text-xs uppercase tracking-wider"
        >
          {[
            "Best Price Guarantee",
            "Limited-Time Offers",
            "Top Destinations",
            "Instant Booking",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-white/70">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 🔽 Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={18} className="text-white/40" />
        </motion.div>

        <span className="text-white/30 text-xs tracking-widest uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}