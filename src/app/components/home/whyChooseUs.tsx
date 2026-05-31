"use client"

import { motion } from "framer-motion"
import {
  ShieldCheck, Headphones, BadgePercent,
  Globe, Award, Clock
} from "lucide-react"

const reasons = [
  {
    icon: ShieldCheck,
    title: "ATOL & ABTA Protected",
    desc: "Every booking is fully protected. Your money is safe with us regardless of what happens.",
  },
  {
    icon: BadgePercent,
    title: "Best Price Guarantee",
    desc: "Find a better price and we'll match it. We work directly with airlines and hotels to secure the best rates.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    desc: "Real travel specialists available around the clock — not bots, not call centres. People who care.",
  },
  {
    icon: Globe,
    title: "120+ Destinations",
    desc: "From Makkah to Maldives, New York to Bali. We cover every corner of the world.",
  },
  {
    icon: Award,
    title: "25+ Years Experience",
    desc: "Trusted by thousands of travellers since 1999. Nottingham's original travel specialist.",
  },
  {
    icon: Clock,
    title: "Instant Confirmation",
    desc: "Book online and receive your confirmation immediately. No waiting, no uncertainty.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium">
            Why Nottingham Travel
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Travel with Confidence
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
            We've been helping families, couples and solo travellers create unforgettable journeys for over two decades.
          </p>
        </motion.div>

        {/* Grid */}
        {/* Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {reasons.map((r, i) => {
    const Icon = r.icon
    return (
      <motion.div
        key={r.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.06 }}
        className="group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-default"
      >
        {/* Icon */}
        <div className="mb-6">
          <Icon
            size={22}
            strokeWidth={1.5}
            className="text-gray-400 group-hover:text-gray-900 transition-colors duration-500"
          />
        </div>

        {/* Number */}
        <span className="absolute top-6 right-6 text-xs font-medium text-gray-200 group-hover:text-gray-400 transition-colors duration-500 tabular-nums">
          0{i + 1}
        </span>

        <h3 className="font-medium text-gray-900 mb-2 text-sm">
          {r.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {r.desc}
        </p>
      </motion.div>
    )
  })}
</div>

      </div>
    </section>
  )
}