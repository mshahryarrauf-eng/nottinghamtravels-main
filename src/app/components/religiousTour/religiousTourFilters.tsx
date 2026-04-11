"use client"

import { motion } from "framer-motion"
import { LayoutGrid, Moon, Star, Globe } from "lucide-react"

export type TourFilterType = "all" | "hajj" | "umrah" | "other"

const filters: { label: string; value: TourFilterType; icon: React.ElementType }[] = [
  { label: "All Tours",  value: "all",   icon: LayoutGrid },
  { label: "Hajj",       value: "hajj",  icon: Star       },
  { label: "Umrah",      value: "umrah", icon: Moon       },
  { label: "Other Tours",value: "other", icon: Globe      },
]

interface ReligiousTourFiltersProps {
  active: TourFilterType
  onChange: (value: TourFilterType) => void
}

export default function ReligiousTourFilters({ active, onChange }: ReligiousTourFiltersProps) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap px-6">
      {filters.map(({ label, value, icon: Icon }) => {
        const isActive = active === value
        return (
          <motion.button
            key={value}
            onClick={() => onChange(value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              border transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-green-500 text-background "
                  : "bg-background text-foreground border-border hover:border-foreground/40"
              }
            `}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}