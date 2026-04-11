"use client"


import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, CalendarDays, ArrowRight, Plane, Hotel, Shield, Bus } from "lucide-react"
import { ReligiousTour } from "@/app/data/religiousTours"

interface ReligiousTourCardProps {
  tour: ReligiousTour
  index: number
}

const categoryStyles: Record<ReligiousTour["category"], string> = {
  hajj:  "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  umrah: "bg-teal-50    text-teal-700    dark:bg-teal-900/30    dark:text-teal-300",
  other: "bg-amber-50   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300",
}

const categoryLabel: Record<ReligiousTour["category"], string> = {
  hajj:  "Hajj",
  umrah: "Umrah",
  other: "Religious Tour",
}

export default function ReligiousTourCard({ tour, index }: ReligiousTourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-60 w-full overflow-hidden">
  <Image
    src={tour.image}
    alt={tour.title}
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

  {/* Price floating */}
  <div className="absolute bottom-3 left-3 text-white">
    <p className="text-lg font-bold">
      {tour.currency} {tour.startingPrice.toLocaleString()}
    </p>
  </div>

  {/* Category badge */}
  <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${categoryStyles[tour.category]}`}>
    {categoryLabel[tour.category]}
  </div>
</div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3">

        {/* Title & destination */}
        <div>
          <h3 className="text-lg font-semibold leading-snug">{tour.title}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin size={13} strokeWidth={1.8} />
            {tour.destination}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {tour.description}
        </p>

        {/* Duration + Departure dates */}
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <Clock size={13} strokeWidth={1.8} className="text-muted-foreground" />
            {tour.duration}
          </p>
          <div className="flex items-start gap-1.5">
            <CalendarDays size={13} strokeWidth={1.8} className="text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Departures:{" "}
              <span className="text-foreground font-medium">
                {tour.departureDates.join("  ·  ")}
              </span>
            </p>
          </div>
        </div>

        {/* Inclusions */}
        <div className="flex flex-wrap gap-2">
          {tour.inclusions.visa && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              <Shield size={11} strokeWidth={2} /> Visa
            </span>
          )}
          {tour.inclusions.flights && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              <Plane size={11} strokeWidth={2} /> Flights
            </span>
          )}
          {tour.inclusions.hotel && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              <Hotel size={11} strokeWidth={2} /> Hotel
            </span>
          )}
          {tour.inclusions.transport && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              <Bus size={11} strokeWidth={2} /> Transport
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-xl font-bold">
              {tour.currency} {tour.startingPrice.toLocaleString()}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Enquire Now
            <ArrowRight size={14} />
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}