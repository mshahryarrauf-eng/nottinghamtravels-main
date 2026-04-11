"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface GuestCounts {
  adults: number
  teens: number
  kids: number
  rooms: number
}

interface HotelGuestFieldProps {
  onGuestsChange?: (counts: GuestCounts) => void
}

export default function HotelGuestField({ onGuestsChange }: HotelGuestFieldProps) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState<GuestCounts>({
    adults: 2, teens: 0, kids: 0, rooms: 1,
  })

  const totalGuests = counts.adults + counts.teens + counts.kids

  function update(type: keyof GuestCounts, delta: number) {
    setCounts((prev) => {
      const next = {
        ...prev,
        [type]: Math.max(
          type === "adults" || type === "rooms" ? 1 : 0,
          prev[type] + delta
        ),
      }
      onGuestsChange?.(next)
      return next
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-10 w-full px-3 text-left border-b border-gray-200 flex items-center justify-between
                           text-gray-900 bg-transparent hover:border-gray-400 transition-colors duration-200">
          <span className="text-sm text-gray-900">
            {`${totalGuests} Guest${totalGuests > 1 ? "s" : ""}, ${counts.rooms} Room${counts.rooms > 1 ? "s" : ""}`}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-4 space-y-4"
      >
        {([
          { label: "Adults (12+)", key: "adults" as const },
          { label: "Teens (2–11)", key: "teens" as const },
          { label: "Kids (0–1)", key: "kids" as const },
          { label: "Rooms", key: "rooms" as const },
        ]).map(({ label, key }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update(key, -1)}
                className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition
                           flex items-center justify-center text-gray-600"
              >−</button>
              <span className="w-5 text-center text-sm font-medium text-gray-900">
                {counts[key]}
              </span>
              <button
                onClick={() => update(key, 1)}
                className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition
                           flex items-center justify-center text-gray-600"
              >+</button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
