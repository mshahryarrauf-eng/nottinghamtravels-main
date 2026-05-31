"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

interface DestinationImage {
  id: string
  src: string
  alt: string
  title: string
}

interface TopDestinationProps {
  images?: {
    portraitOne: DestinationImage
    portraitTwo: DestinationImage
    landscapeOne: DestinationImage
    landscapeTwo: DestinationImage
  }
}

export default function TopDestination({
  images = {
    portraitOne: {
      id: "1",
      src: "/japan.webp",
      alt: "Okinawa, Japan",
      title: "Japan"
    },
    portraitTwo: {
      id: "2",
      src: "/usa.webp",
      alt: "Montana, USA",
      title: "United States"
    },
    landscapeOne: {
      id: "3",
      src: "/italy.webp",
      alt: "Sardinia, Italy",
      title: "Italy"
    },
    landscapeTwo: {
      id: "4",
      src: "/rico.webp",
      alt: "Puerto Rico",
      title: "Puerto Rico"
    }
  }
}: TopDestinationProps) {
  return (
    <section className="w-full bg-neutral-50 py-28">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Heading Section */}
        {/* Heading Section */}
{/* Heading Section */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="text-center mb-20 space-y-4 max-w-2xl mx-auto"
>
  <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium">
    Explore The World
  </p>

  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
    Top Notch Destination
  </h2>

  <p className="text-neutral-500 text-lg leading-relaxed">
    Discover breathtaking escapes curated for the modern traveler — where
    refined luxury meets unforgettable landscapes and timeless experiences.
  </p>
</motion.div>

        {/* Modern Frame */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-white shadow-sm border border-neutral-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200">

            {/* Column 1 */}
            <MotionImageCard image={images.portraitOne} aspect="portrait" />

            {/* Column 2 */}
            <MotionImageCard image={images.portraitTwo} aspect="portrait" />

            {/* Column 3 */}
            <div className="flex flex-col gap-px bg-neutral-200">
              <MotionImageCard image={images.landscapeOne} aspect="landscape" />
              <MotionImageCard image={images.landscapeTwo} aspect="landscape" />
            </div>

          </div>
        </motion.div>

      </div>

      {/* More Destinations Button */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.2 }}
  viewport={{ once: true }}
  className="flex justify-center mt-16"
>
  <Link
    href="/destinations"
    className="group relative inline-flex items-center gap-3 px-8 py-4 border border-neutral-900 text-neutral-900 text-sm tracking-wider uppercase transition-all duration-500 hover:bg-neutral-900 hover:text-white"
  >
    <span>More Destinations</span>

    {/* Minimal arrow */}
    <span className="transition-transform duration-500 group-hover:translate-x-1">
      →
    </span>
  </Link>
</motion.div>

    </section>
  )
}

/* -------------------- Image Card -------------------- */

function MotionImageCard({
  image,
  aspect
}: {
  image: DestinationImage
  aspect: "portrait" | "landscape"
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative w-full bg-white overflow-hidden ${
        aspect === "portrait"
          ? "h-130"
          : "h-65"
      }`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

      {/* Country Title */}
      <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <h3 className="text-white text-2xl md:text-3xl font-medium tracking-wide">
          {image.title}
        </h3>
      </div>
    </motion.div>

    
  )
}
