"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

export default function AboutStory() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative h-[560px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/bg.jpg"
                alt="Our story"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-[220px] border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Head Office</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                161 Radford Road<br />
                Nottingham NG7 5EH
              </p>
              <div className="mt-3 h-1 w-8 bg-gray-900 rounded-full" />
            </motion.div>

            {/* Year badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-gray-900 flex flex-col items-center justify-center shadow-xl"
            >
              <span className="text-white text-xs font-medium opacity-60">Since</span>
              <span className="text-white text-lg font-bold leading-none">1999</span>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="space-y-8"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium mb-4">
                Our Story
              </p>
              <h2 className="text-4xl md:text-3xl font-semibold tracking-tight text-gray-900 leading-tight">
                Born in Nottingham, Built for the World
                <span className="block font-light italic mt-1">
                  
                </span>
              </h2>
            </div>

            <div className="space-y-5 text-black leading-relaxed">
              <p>
                Nottingham Travel began in 1999 with a single office on Radford Road and one
                simple mission — to make travel accessible, affordable and stress-free for
                every family in our community.
              </p>
              <p>
                Over two and a half decades later, we've grown into one of the UK's most
                trusted independent travel agencies, with a second branch in Bradford and
                a team of dedicated specialists who've visited many of the destinations
                they recommend.
              </p>
              <p>
                From Hajj and Umrah packages to luxury Maldives escapes, family holidays
                in Dubai and flights to every corner of the globe — we handle every detail
                so you can focus on what matters: the journey itself.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { label: "Nottingham HQ", sub: "161 Radford Road, NG7 5EH" },
                { label: "Bradford Branch", sub: "830 Leeds Road, BD3 9TX" },
                { label: "ATOL Protected", sub: "Your money is always safe" },
                { label: "ABTA Member", sub: "Full financial protection" },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
