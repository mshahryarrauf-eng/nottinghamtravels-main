"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, ArrowRight, Tag } from "lucide-react"

interface Offer {
  _id: string
  title: string
  destination?: string
  description?: string
  images?: string[]
  amount: number
  currency?: string
  category?: string[]
  slug?: string
}

interface Props {
  offers: Offer[]
}

export default function ReligiousOffersSection({ offers }: Props) {
  if (offers.length === 0) {
    return (
      <section className="py-24 text-center text-muted-foreground">
        <p className="text-lg">No religious offers available right now. Check back soon.</p>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background to-background/60">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold">Sacred Journey Packages</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Carefully selected offers for Hajj, Umrah, and spiritual travel worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={offer.images?.[0] || "/religious-bg.jpg"}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Price badge */}
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-lg font-bold">
                    {offer.currency ?? "GBP"} {Number(offer.amount).toLocaleString()}
                  </p>
                </div>

                {/* Category badge */}
                {offer.category?.[0] && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    <Tag size={10} />
                    {offer.category[0]}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5 space-y-3">
                <div>
                  <h3 className="text-base font-semibold leading-snug">{offer.title}</h3>
                  {offer.destination && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin size={12} strokeWidth={1.8} />
                      {offer.destination}
                    </p>
                  )}
                </div>

                {offer.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>
                )}

                <div className="border-t border-border mt-auto pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-lg font-bold">
                      {offer.currency ?? "GBP"} {Number(offer.amount).toLocaleString()}
                    </p>
                  </div>
                  <motion.a
                    href={offer.slug ? `/offer-details/${offer.slug}` : "#"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    View
                    <ArrowRight size={13} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}