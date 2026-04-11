"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Aisha Mahmood",
    location: "Nottingham",
    rating: 5,
    text: "Booked our Umrah package through Nottingham Travel and the entire experience was seamless. From the visa to the hotel — everything was arranged perfectly. Highly recommend.",
    trip: "Umrah Package",
  },
  {
    name: "James & Sarah Carter",
    location: "Derby",
    rating: 5,
    text: "Our holiday to Dubai was absolutely incredible. The team found us a 5-star deal we couldn't have found ourselves. The kids loved every minute.",
    trip: "Dubai Family Holiday",
  },
  {
    name: "Mohammed Khalid",
    location: "Bradford",
    rating: 5,
    text: "I've been using Nottingham Travel for my family flights to Pakistan for years. Always the best prices and never a problem. They're the only agency I trust.",
    trip: "Return Flights to Lahore",
  },
  {
    name: "Priya Sharma",
    location: "Leicester",
    rating: 5,
    text: "Booked a last-minute Maldives trip and they sorted everything within 24 hours. Hotel, flights, transfers — all perfect. Will definitely be back.",
    trip: "Maldives Getaway",
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const items = [...testimonials, ...testimonials]

  return (
    <section className="py-24 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16 space-y-3"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium">
        Customer Stories
      </p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
        Loved by Travellers
      </h2>
    </motion.div>
  </div>

  {/* Marquee */}
  <div className="overflow-hidden">
    <div
      className="flex gap-5 w-max items-stretch"
      style={{ animation: "testimonial-marquee 35s linear infinite" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.animationPlayState = "paused")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.animationPlayState = "running")
      }
    >
      {items.map((t, i) => (
        <div
          key={`${t.name}-${i}`}
          className="flex-shrink-0 w-[280px] flex"
        >
          <div className="flex flex-col flex-1 bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <Quote size={24} className="text-gray-200 mb-2" />

            {/* Content grows to fill space */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              {t.text}
            </p>

            {/* Footer stays aligned */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <Stars count={t.rating} />
              <p className="font-semibold text-gray-900 text-sm mt-2">
                {t.name}
              </p>
              <p className="text-gray-400 text-xs">
                {t.location} · {t.trip}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Rating Badge */}
  <div className="flex justify-center mt-12">
    <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-6 py-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">
        4.9 / 5
      </span>
      <span className="text-gray-400 text-xs">
        based on 200+ reviews
      </span>
    </div>
  </div>

  {/* Animation */}
  <style>{`
    @keyframes testimonial-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `}</style>
</section>
  )
}