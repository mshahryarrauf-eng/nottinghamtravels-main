"use client"


import { motion } from "framer-motion"
import { Plane, Hotel, Package, LayoutGrid } from "lucide-react"

export type FilterType = "all" | "flight" | "hotel" | "package"

const filters: { label: string; value: FilterType; icon: React.ElementType }[] = [
  { label: "All Offers",  value: "all",     icon: LayoutGrid },
  { label: "Flights",     value: "flight",  icon: Plane      },
  { label: "Hotels",      value: "hotel",   icon: Hotel      },
  { label: "Packages",    value: "package", icon: Package    },
]

interface OfferFiltersProps {
  active: FilterType
  onChange: (value: FilterType) => void
}

export default function OfferFilters({ active, onChange }: OfferFiltersProps) {
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