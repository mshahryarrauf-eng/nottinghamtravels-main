"use client"

// ─────────────────────────────────────────────
//  components/customQuery/queryDateField.tsx
//  Mirrors your existing DateField style from
//  the hero flight form — uses shadcn Popover
//  + Calendar under the hood.
// ─────────────────────────────────────────────

import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

interface QueryDateFieldProps {
  label: string
  value: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  disableBefore?: Date
  error?: string
}

export default function QueryDateField({
  label,
  value,
  onSelect,
  placeholder = "Select date",
  disableBefore,
  error,
}: QueryDateFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm text-left
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          transition-all duration-200 cursor-pointer
          ${error ? "border-destructive" : "border-border"}
          ${value ? "text-foreground" : "text-muted-foreground"}
        `}
      >
        <CalendarDays size={15} strokeWidth={1.8} className="text-muted-foreground shrink-0" />
        {value ? format(value, "dd MMM yyyy") : placeholder}
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-0 z-50 mt-2 rounded-2xl border border-border bg-card shadow-xl p-3"
            >
              <DayPicker
                mode="single"
                selected={value}
                onSelect={(d) => { onSelect(d); setOpen(false) }}
                disabled={disableBefore ? { before: disableBefore } : undefined}
                fromDate={new Date()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}