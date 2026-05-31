"use client"

// ─────────────────────────────────────────────
//  components/customQuery/queryInputField.tsx
// ─────────────────────────────────────────────

import { forwardRef } from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

const QueryInputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            w-full rounded-xl border border-border bg-background px-4 py-3 text-sm
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-destructive focus:ring-destructive" : ""}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
)

QueryInputField.displayName = "QueryInputField"
export default QueryInputField