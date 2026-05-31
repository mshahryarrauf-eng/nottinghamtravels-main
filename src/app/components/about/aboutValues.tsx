"use client"

import { motion } from "framer-motion"
import {
  Heart, ShieldCheck, Globe, Users, Sparkles, Clock
} from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "People First",
    desc: "Every decision we make starts with our customers. Your experience, your safety, and your happiness are at the centre of everything we do.",
    color: "from-rose-50 to-pink-50",
    iconColor: "text-rose-500",
    border: "group-hover:border-rose-200",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "No hidden fees, no small print surprises. We're fully ATOL and ABTA accredited — your money is protected from the moment you book.",
    color: "from-blue-50 to-sky-50",
    iconColor: "text-blue-500",
    border: "group-hover:border-blue-200",
  },
  {
    icon: Globe,
    title: "World Knowledge",
    desc: "Our team has personally visited many of the destinations we recommend. Real experience, not just brochures.",
    color: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-500",
    border: "group-hover:border-emerald-200",
  },
  {
    icon: Users,
    title: "Community Roots",
    desc: "We grew up in Nottingham and Bradford. We understand our communities, speak your languages, and share your values.",
    color: "from-violet-50 to-purple-50",
    iconColor: "text-violet-500",
    border: "group-hover:border-violet-200",
  },
  {
    icon: Sparkles,
    title: "Attention to Detail",
    desc: "From your visa application to your airport transfer — we handle every detail meticulously so nothing falls through the cracks.",
    color: "from-amber-50 to-yellow-50",
    iconColor: "text-amber-500",
    border: "group-hover:border-amber-200",
  },
  {
    icon: Clock,
    title: "Always Available",
    desc: "Travel doesn't stop at 5pm. Our team is available 24/7 to help with emergencies, changes, and last-minute bookings.",
    color: "from-orange-50 to-red-50",
    iconColor: "text-orange-500",
    border: "group-hover:border-orange-200",
  },
]

export default function AboutValues() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium mb-4">
              What We Stand For
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Our Values Drive Everything
            </h2>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            These aren't just words on a wall. They're the principles that guide
            every booking we make and every conversation we have.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative rounded-2xl border border-gray-100 ${v.border} bg-gradient-to-br ${v.color} p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                {/* Large background icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.06]">
                  <Icon size={120} strokeWidth={1} />
                </div>

                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white shadow-sm mb-5 ${v.iconColor}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
