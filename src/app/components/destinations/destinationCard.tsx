"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function DestinationCard({
  title,
  image,
}: {
  title: string
  image: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="group relative h-[420px] w-full overflow-hidden bg-neutral-100"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* Title */}
      <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <h3 className="text-white text-2xl font-medium tracking-wide">
          {title}
        </h3>
      </div>
    </motion.div>
  )
}