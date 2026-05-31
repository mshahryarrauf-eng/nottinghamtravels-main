"use client"

// ─────────────────────────────────────────────
//  components/customQuery/querySelectField.tsx
// ─────────────────────────────────────────────

import { forwardRef } from "react"

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: React.ReactNode
  options: { value: string; label: string }[]
  error?: string
}

const QuerySelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, icon, options, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <select
          ref={ref}
          {...props}
          className={`
            w-full rounded-xl border border-border bg-background px-4 py-3 text-sm
            text-foreground appearance-none
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-200 cursor-pointer
            ${icon ? "pl-10" : ""}
            ${error ? "border-destructive focus:ring-destructive" : ""}
            ${className}
          `}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
)

QuerySelectField.displayName = "QuerySelectField"
export default QuerySelectField