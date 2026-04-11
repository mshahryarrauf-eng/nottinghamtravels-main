// "use client"

// import Image from "next/image"
// import { motion } from "framer-motion"
// import { Compass } from "lucide-react"

// export default function ReligiousTourHero() {
//   return (
//     <section className="relative h-[70vh] min-h-125 w-full overflow-hidden">

//       {/* Background image */}
//       <motion.div
//         className="absolute inset-0 -z-10"
//         initial={{ scale: 1.05 }}
//         animate={{ scale: 1.1 }}
//         transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
//       >
//         <Image
//           src="/bg.jpg"
//           alt="Religious pilgrimage tours"
//           fill
//           priority
//           className="object-cover"
//         />
//         {/* Dark overlay — same as Hero in hero.tsx */}
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
//       </motion.div>

//       {/* Content */}
//       <div className="container mx-auto flex h-full items-center justify-center px-6">
//         <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6">

//           {/* Badge */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
//           >
//             <Compass size={14} strokeWidth={2} />
//             Sacred Journeys
//           </motion.div>

//           {/* Heading */}
//           <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.1 }}
//             className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-tight"
//           >
//             Religious &
//             <span className="block font-light italic">
//               Pilgrimage Tours
//             </span>
//           </motion.h1>

//           {/* Subtext */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.25 }}
//             className="text-white/75 text-lg max-w-2xl leading-relaxed"
//           >
//             From Hajj & Umrah to the Holy Land and beyond — spiritually curated
//             journeys for every faith, handled with care.
//           </motion.p>

//         </div>
//       </div>

//     </section>
//   )
// }

"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Compass, ArrowDown } from "lucide-react"

export default function ReligiousTourHero() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src="/religious-bg.jpg"
          alt="Religious pilgrimage tours"
          fill
          priority
          className="object-cover"
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto text-white"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 text-xs uppercase tracking-widest mb-6"
        >
          <Compass size={14} />
          Sacred Journeys
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-7xl font-semibold leading-[1.05] mb-6"
        >
          Spiritual Journeys

        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
        >
          From Hajj & Umrah to sacred destinations worldwide — thoughtfully
          curated experiences for a meaningful journey.
        </motion.p>

        {/* Trust points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-10 text-xs uppercase"
        >
          {[
            "Trusted Guidance",
            "All-Inclusive Packages",
            "Spiritual Comfort",
            "Expert Support",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-white/70">
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <ArrowDown size={18} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}