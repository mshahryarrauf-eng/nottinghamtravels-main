"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"

export default function AboutCTA() {
  return (
    <section className="relative py-28 px-6 bg-gray-900 overflow-hidden">

      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full border border-white/5" />
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full border border-white/5" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-white/5" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/5" />

      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white font-medium mb-6">
            Ready to Travel?
          </p>
          <h2 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight mb-6">
            Your Next
              Adventure Awaits
          </h2>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Whether it's a Hajj package, a family holiday, or a solo adventure —
            our team is ready to make it happen. Get in touch today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/specialQuery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Send Us a Query <ArrowRight size={15} />
            </Link>
            <a
              href="tel:01159787899"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone size={15} /> 01159 78 78 99
            </a>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-8 mt-16 flex-wrap">
            {[
              ["ATOL", "Protected"],
              ["ABTA", "Member"],
              ["25+", "Years"],
              ["10k+", "Trips"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-white text-lg font-bold">{val}</p>
                <p className="text-white/30 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
