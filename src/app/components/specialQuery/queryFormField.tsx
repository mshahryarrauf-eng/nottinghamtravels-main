"use client"

// ─────────────────────────────────────────────
//  components/customQuery/queryFormField.tsx
//  Reusable input / select / textarea — styled
//  to match the glassmorphism form in hero.tsx
// ─────────────────────────────────────────────

import { forwardRef } from "react"

// ── Text / Email / Tel / Number Input ─────────
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
InputField.displayName = "InputField"


// ── Select ────────────────────────────────────
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: React.ReactNode
  options: { value: string; label: string }[]
  error?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
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
        {/* Chevron */}
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
SelectField.displayName = "SelectField"


// ── Textarea ──────────────────────────────────
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, icon, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-4 text-muted-foreground">
            {icon}
          </span>
        )}
        <textarea
          ref={ref}
          rows={4}
          {...props}
          className={`
            w-full rounded-xl border border-border bg-background px-4 py-3 text-sm
            placeholder:text-muted-foreground resize-none
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
TextareaField.displayName = "TextareaField"