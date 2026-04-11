"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface PassengerCounts {
  adults: number
  teens: number
  kids: number
}

interface PassengerFieldProps {
  onPassengersChange?: (counts: PassengerCounts) => void
}

export default function PassengerField({ onPassengersChange }: PassengerFieldProps) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState<PassengerCounts>({
    adults: 1,
    teens: 0,
    kids: 0,
  })

  const total = counts.adults + counts.teens + counts.kids

  function update(type: keyof PassengerCounts, delta: number) {
    setCounts((prev) => {
      const next = {
        ...prev,
        [type]: Math.max(type === "adults" ? 1 : 0, prev[type] + delta),
      }
      onPassengersChange?.(next)
      return next
    })
  }

  return (
    <div className="w-full">
      {/* ✅ Label on top */}
      <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">
        Passengers
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="h-10 w-full px-3 text-left border-b border-gray-200 flex items-center justify-between
                             hover:border-gray-400 transition-colors duration-200 bg-transparent">
            <span className="text-gray-900 font-bold text-sm">
              {`${total} Passenger${total > 1 ? "s" : ""}`}
            </span>
            <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-4 space-y-4 z-[9999]"
        >
          {([
            { label: "Adults (12+)", key: "adults" as const },
            { label: "Teens (2–11)", key: "teens" as const },
            { label: "Kids (0–1)",   key: "kids"   as const },
          ]).map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update(key, -1)}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition
                             flex items-center justify-center text-gray-600 font-medium"
                >−</button>
                <span className="w-4 text-center text-sm font-bold text-gray-900">
                  {counts[key]}
                </span>
                <button
                  onClick={() => update(key, 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition
                             flex items-center justify-center text-gray-600 font-medium"
                >+</button>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
