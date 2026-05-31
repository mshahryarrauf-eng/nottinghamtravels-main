// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { Offer } from "@/app/data/offers"
// import OfferCard from "./offerCard"

// interface OfferGridProps {
//   offers: Offer[]
// }

// export default function OfferGrid({ offers }: OfferGridProps) {
//   if (offers.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="col-span-full text-center py-24 text-muted-foreground text-lg"
//       >
//         No offers found in this category right now. Check back soon!
//       </motion.div>
//     )
//   }

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={offers.map((o) => o._id).join("-")}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.3 }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//       >
//         {offers.map((offer, i) => (
//           <OfferCard key={offer._id} offer={offer} index={i} />
//         ))}
//       </motion.div>
//     </AnimatePresence>
//   )
// }

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Offer } from "@/app/data/offers"
import OfferCard from "./offerCard"

interface OfferGridProps {
  offers: Offer[]
}

export default function OfferGrid({ offers }: OfferGridProps) {
  if (offers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full text-center py-24 text-muted-foreground text-lg"
      >
        No offers found in this category right now. Check back soon!
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={offers.map((o) => o._id).join("-")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {offers.map((offer, i) => (
          <OfferCard key={offer._id} offer={offer} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}