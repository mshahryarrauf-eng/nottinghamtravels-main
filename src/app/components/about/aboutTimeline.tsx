"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const events = [
  { year: "1999", title: "The Beginning", desc: "Started small with a big vision." },
  { year: "2004", title: "Accreditation", desc: "ATOL & ABTA certified." },
  { year: "2009", title: "Hajj & Umrah", desc: "Specialist travel services launched." },
  { year: "2015", title: "Expansion", desc: "Opened Bradford branch." },
  { year: "2019", title: "10,000 Customers", desc: "Major milestone reached." },
  { year: "2024", title: "Digital Shift", desc: "Launched online platform." },
]

export default function ScrollTimeline() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Move left as user scrolls down
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"])

  return (
    <section ref={ref} className="h-[300vh] bg-white relative">
      
      {/* Sticky container */}
<div className="sticky top-0 h-[70vh] flex items-start pt-24 overflow-hidden">
            {/* Timeline */}
        <motion.div style={{ x }} className="flex gap-10 px-10">

          {events.map((e, i) => (
            <motion.div
  key={i}
  className="relative min-w-[420px] group"
>

  {/* Glow */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-200/40 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

  {/* Card */}
  <div className="relative rounded-3xl border border-white/20 bg-white/60 backdrop-blur-xl p-10 overflow-hidden transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">

    {/* Big background year */}
    <span className="absolute -top-4 -right-4 text-[110px] font-bold text-gray-200 opacity-30 select-none">
      {e.year}
    </span>

    {/* Year */}
    <p className="text-sm tracking-[0.35em] uppercase text-gray-400 mb-6">
      {e.year}
    </p>

    {/* Title */}
    <h3 className="text-2xl font-semibold text-gray-900 mb-4 leading-snug">
      {e.title}
    </h3>

    {/* Divider */}
    <div className="w-12 h-[2px] bg-gray-900 mb-5" />

    {/* Description */}
    <p className="text-base text-gray-600 leading-relaxed">
      {e.desc}
    </p>

  </div>
</motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  )
}