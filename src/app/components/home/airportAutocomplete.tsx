"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MapPin } from "lucide-react"

interface AirportOption {
  label: string
  iata: string
  city: string
  name: string
  country: string
}

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder = "City or code",
}: Props) {
  const [inputValue, setInputValue] = useState(value)
  const [options, setOptions] = useState<AirportOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const fetchAirports = useCallback(async (q: string) => {
    if (q.length < 2) {
      setOptions([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/airports?q=${encodeURIComponent(q)}`)
      const data: AirportOption[] = await res.json()
      setOptions(data)
      setOpen(data.length > 0)
      setActiveIndex(-1)
    } catch {
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    onChange(val) // keep parent in sync while typing

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchAirports(val), 220)
  }

  function handleSelect(option: AirportOption) {
    // Store the IATA code as the form value, show "City — CODE" in the input
    const display = `${option.city} — ${option.iata}`
    setInputValue(display)
    onChange(option.iata) // only the code goes to the form
    setOpen(false)
    setOptions([])
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(options[activeIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full group">
      {label && (
        <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => options.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-10 w-full px-3 bg-transparent outline-none border-b border-gray-200
                     focus:border-gray-900 transition-colors duration-200
                     text-gray-900 font-bold
                     placeholder:text-gray-500 placeholder:font-semibold"
        />
        {loading && (
          <span className="absolute right-2 top-2.5 h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
        )}
      </div>

      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-900 transition-all duration-300 group-focus-within:w-full" />

      {/* Dropdown */}
      {open && options.length > 0 && (
        <ul
          className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200
                     rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
          role="listbox"
        >
          {options.map((opt, i) => (
            <li
              key={opt.iata}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(opt)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
                ${i === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span>
                <span className="font-semibold text-gray-900">{opt.city}</span>
                <span className="text-gray-400 mx-1">·</span>
                <span className="text-gray-500 text-xs">{opt.name}</span>
              </span>
              <span className="ml-auto font-bold text-green-600 text-xs">{opt.iata}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}