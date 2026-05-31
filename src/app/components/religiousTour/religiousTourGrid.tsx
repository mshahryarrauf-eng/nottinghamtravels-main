"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReligiousTour } from "@/app/data/religiousTours"
import ReligiousTourCard from "./religiousTourCard"

interface ReligiousTourGridProps {
  tours: ReligiousTour[]
}

export default function ReligiousTourGrid({ tours }: ReligiousTourGridProps) {
  if (tours.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full text-center py-24 text-muted-foreground text-lg"
      >
        No tours available in this category right now. Please check back soon!
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tours.map((t) => t._id).join("-")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"      >
        {tours.map((tour, i) => (
          <ReligiousTourCard key={tour._id} tour={tour} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}