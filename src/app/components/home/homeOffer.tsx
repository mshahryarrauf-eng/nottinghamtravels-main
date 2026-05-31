"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, ArrowRight } from "lucide-react"

const categoryStyles: Record<string, string> = {
  flight:  "bg-blue-50 text-blue-600",
  hotel:   "bg-amber-50 text-amber-600",
  package: "bg-green-50 text-green-600",
}

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function OfferCard({ offer }: { offer: any }) {
  const categories: string[] = Array.isArray(offer.categories) ? offer.categories : []
  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full">
      <Link href={`/offer-details/${offer.slug}`} className="flex flex-col flex-1">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
          {offer.image && offer.image !== "/placeholder.jpg"
            ? <Image src={offer.image}   alt={offer.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
          }
          {offer.discount > 0 && <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">-{offer.discount}% OFF</div>}
         </div>
        <div className="flex flex-col flex-1 p-4 space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${categoryStyles[offer.category] ?? "bg-gray-100 text-gray-600"}`}>{offer.category}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">{offer.title}</h3>
            {offer.destination && <p className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin size={11} strokeWidth={1.8} /> {offer.destination}</p>}
          </div>
          <div className="text-xs text-gray-400 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: offer.description }} />
          {offer.validUntil && <p className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} strokeWidth={1.8} /> Valid until {formatDate(offer.validUntil)}</p>}
          <div className="border-t border-gray-100 mt-auto pt-3">
            <div className="flex items-center justify-between">
              <div>
                {offer.discount > 0 && <p className="text-xs text-gray-400 line-through">{offer.currency} {offer.originalPrice?.toLocaleString()}</p>}
                <p className="text-base font-bold text-gray-900">{offer.currency} {offer.discountedPrice?.toLocaleString()}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium">Book <ArrowRight size={11} /></span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function HomeOffers({ offers }: { offers: any[] }) {
  if (!offers || offers.length === 0) return null

  // Duplicate for seamless loop
  const items = [...offers, ...offers]

  return (
    <section className="py-20 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Handpicked For You</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Special Offers
                      </h2>
        </motion.div>

        {/* Marquee */}
        <div
          className=""
        >
          <div
            className="flex gap-5 w-max items-stretch"
            style={{
              animation: "offers-marquee 35s linear infinite", // ⚡ SPEED: lower = faster, higher = slower
            }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
          >
            {items.map((offer, i) => (
              <div key={`${offer._id}-${i}`} className="flex-shrink-0" style={{ width: "300px" }}>
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link href="/special-offers" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-all duration-200">
            View All Offers <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes offers-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}