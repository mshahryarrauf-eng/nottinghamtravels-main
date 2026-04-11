"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Offer } from "@/app/data/offers"

interface OfferCardProps {
  offer: Offer
  index: number
}

const categoryStyles: Record<Offer["category"], string> = {
  flight:  "bg-blue-50  text-blue-600  dark:bg-blue-900/30  dark:text-blue-300",
  hotel:   "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  package: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300",
}

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default function OfferCard({ offer, index }: OfferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Entire card is clickable */}
      <Link href={`/offer-details/${offer.slug}`} className="flex flex-col flex-1">

        {/* Image */}
        <div className="relative h-60 w-full overflow-hidden">
  <Image
    src={offer.image}
    alt={offer.title}
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />

  {/* Dark gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

  {/* Price floating */}
  <div className="absolute bottom-3 left-3 text-white">
    <p className="text-lg font-bold">
      {offer.currency} {offer.discountedPrice.toLocaleString()}
    </p>
    {offer.discount > 0 && (
      <p className="text-xs line-through opacity-70">
        {offer.currency} {offer.originalPrice.toLocaleString()}
      </p>
    )}
  </div>

  {/* Discount badge */}
  {offer.discount > 0 && (
    <div className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
      -{offer.discount}%
    </div>
  )}
</div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 space-y-3">

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(offer.category) ? offer.category : [offer.category]).map((cat) => (
              <span
                key={cat}
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  categoryStyles[cat as Offer["category"]] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title & destination */}
          <div>
            <h3 className="text-lg font-semibold leading-snug">{offer.title}</h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin size={13} strokeWidth={1.8} />
              {offer.destination}
            </p>
          </div>

          {/* Description — renders HTML from rich text editor */}
          <div
            className="text-sm text-muted-foreground leading-relaxed line-clamp-2"
            dangerouslySetInnerHTML={{ __html: offer.description }}
          />

          {/* Valid until */}
          {offer.validUntil && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} strokeWidth={1.8} />
              Valid until {formatDate(offer.validUntil)}
            </p>
          )}

          <div className="border-t border-border" />

          {/* Price & CTA */}
          <div className="flex justify-end pt-3">
  <span className="text-sm font-medium text-primary flex items-center gap-1">
    View Deal <ArrowRight size={14} />
  </span>
</div>

        </div>
      </Link>
    </motion.div>
  )
}