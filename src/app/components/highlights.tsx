"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Map,
  Plane,
  Star,
  Clock,
  Globe,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Certified Agents" },
  { icon: Map, title: "30000+ Things To Do" },
  { icon: Plane, title: "Top Rated Airlines" },
  { icon: Star, title: "Top Rated Experiences" },
  { icon: Clock, title: "24/7 Support" },
  { icon: Globe, title: "120+ Countries" },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full py-12 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex-1 flex flex-col items-center text-center px-6 py-4 border-r-2 border-gray-200 dark:border-neutral-800"
              >
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className="mb-3"
                />
                <p className="text-sm font-medium">
                  {feature.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
