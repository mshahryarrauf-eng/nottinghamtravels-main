"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src="/about-bg.jpg"
          alt="About Nottingham Travel"
          fill
          priority
          className="object-cover"
        />
        {/* Layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-xs uppercase tracking-[0.4em] mb-6 font-medium"
        >
          Est. 1999 · Nottingham, United Kingdom
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl md:text-7xl font-semibold tracking-tight text-white leading-[1.0] mb-6"
        >
          We Live & Breathe Travel

          <span className="block font-light italic text-white/80">
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          For over 25 years, we've been connecting families, couples and solo
          travellers with the world's most extraordinary destinations.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex items-center justify-center gap-6 mt-10 flex-wrap"
        >
          {["ATOL Protected", "ABTA Member", "25+ Years", "10,000+ Trips"].map((b) => (
            <span key={b} className="text-white text-xs font-medium flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              {b}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown size={18} className="text-white/40" />
        </motion.div>
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
