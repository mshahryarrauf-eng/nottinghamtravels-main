"use client"

// ─────────────────────────────────────────────
//  components/customQuery/queryPassengerField.tsx
//  Counter UI matching your PassengerField style
// ─────────────────────────────────────────────

import { useState } from "react"
import { Users, Minus, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PassengerCounts {
  adults: number
  children: number
  infants: number
}

interface QueryPassengerFieldProps {
  value: PassengerCounts
  onChange: (val: PassengerCounts) => void
  error?: string
}

const passengerTypes: { key: keyof PassengerCounts; label: string; sub: string; min: number }[] = [
  { key: "adults",   label: "Adults",   sub: "12+ years",   min: 1 },
  { key: "children", label: "Children", sub: "2–11 years",  min: 0 },
  { key: "infants",  label: "Infants",  sub: "Under 2",     min: 0 },
]

export default function QueryPassengerField({
  value,
  onChange,
  error,
}: QueryPassengerFieldProps) {
  const [open, setOpen] = useState(false)

  const total = value.adults + value.children + value.infants
  const label = total === 1 ? "1 Passenger" : `${total} Passengers`

  const update = (key: keyof PassengerCounts, delta: number) => {
    const type = passengerTypes.find((t) => t.key === key)!
    const next = Math.max(type.min, value[key] + delta)
    onChange({ ...value, [key]: next })
  }

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-sm font-medium text-foreground">Passengers</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm text-left
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          transition-all duration-200 cursor-pointer
          ${error ? "border-destructive" : "border-border"}
          text-foreground
        `}
      >
        <Users size={15} strokeWidth={1.8} className="text-muted-foreground shrink-0" />
        {label}
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-card shadow-xl p-4 space-y-4"
            >
              {passengerTypes.map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => update(key, -1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer disabled:opacity-30"
                      disabled={value[key] <= (key === "adults" ? 1 : 0)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{value[key]}</span>
                    <button
                      type="button"
                      onClick={() => update(key, 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full mt-2 rounded-xl bg-foreground text-background text-sm font-medium py-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}