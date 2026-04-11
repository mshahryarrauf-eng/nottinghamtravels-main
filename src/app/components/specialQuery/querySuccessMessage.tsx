"use client"

// ─────────────────────────────────────────────
//  components/customQuery/querySuccessMessage.tsx
// ─────────────────────────────────────────────

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface QuerySuccessMessageProps {
  onReset: () => void
}

export default function QuerySuccessMessage({ onReset }: QuerySuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 18 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-6"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-foreground/5 border border-border flex items-center justify-center"
      >
        <CheckCircle2 size={40} strokeWidth={1.5} className="text-foreground" />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-semibold tracking-tight">
          Query Submitted!
        </h2>
        <p className="text-muted-foreground text-lg max-w-md">
          Thank you for reaching out. Our team will review your request and
          get back to you within 24 hours.
        </p>
      </motion.div>

      {/* Reset button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onReset}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        Submit Another Query
      </motion.button>
    </motion.div>
  )
}