"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: 25,    suffix: "+",  label: "Years Experience",    desc: "Serving UK travellers since 1999" },
  { value: 10000, suffix: "+",  label: "Happy Travellers",    desc: "Families, couples & solo explorers" },
  { value: 120,   suffix: "+",  label: "Destinations",        desc: "Across every continent" },
  { value: 98,    suffix: "%",  label: "Satisfaction Rate",   desc: "Based on verified customer reviews" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setCount(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function AboutStats() {
  return (
    <section className="bg-gray-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-gray-900 px-8 py-10 text-center"
            >
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm font-semibold text-white/80 mb-1">{s.label}</p>
              <p className="text-xs text-white/40">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
