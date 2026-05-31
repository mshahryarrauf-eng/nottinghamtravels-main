"use client"

import { motion } from "framer-motion"
import DestinationCard from "./destinationCard"

const destinations = [
  {
    title: "Japan",
    image: "/japan.webp",
  },
  {
    title: "United States",
    image: "/usa.webp",
  },
  {
    title: "Italy",
    image: "/italy.webp",
  },
  {
    title: "Puerto Rico",
    image: "/rico.webp",
  },
  {
    title: "Switzerland",
    image: "/swiss.webp",
  },
  {
    title: "Maldives",
    image: "/maldives.webp",
  },
]

export default function DestinationGrid() {
  return (
    <section className="pb-28 px-6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {destinations.map((item, index) => (
            <DestinationCard key={index} {...item} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}