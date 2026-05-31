// "use client"

// import { useState, useRef, useEffect, useCallback } from "react"
// import { Plane } from "lucide-react"

// interface AirlineOption {
//   label: string
//   name: string
//   iata: string
//   icao: string
//   country: string
//   active: boolean
// }

// interface Props {
//   label?: string
//   value: string
//   onChange: (value: string) => void
//   placeholder?: string
// }

// export default function AirlineAutocomplete({
//   label,
//   value,
//   onChange,
//   placeholder = "Airline name or code",
// }: Props) {
//   const [inputValue, setInputValue] = useState(value)
//   const [options, setOptions] = useState<AirlineOption[]>([])
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [activeIndex, setActiveIndex] = useState(-1)

//   const wrapperRef = useRef<HTMLDivElement>(null)
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

//   useEffect(() => {
//     setInputValue(value)
//   }, [value])

//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClick)
//     return () => document.removeEventListener("mousedown", handleClick)
//   }, [])

//   const fetchAirlines = useCallback(async (q: string) => {
//     if (q.length < 2) {
//       setOptions([])
//       setOpen(false)
//       return
//     }
//     setLoading(true)
//     try {
//       const res = await fetch(`/api/airlines?q=${encodeURIComponent(q)}`)
//       const data: AirlineOption[] = await res.json()
//       setOptions(data)
//       setOpen(data.length > 0)
//       setActiveIndex(-1)
//     } catch {
//       setOptions([])
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const val = e.target.value
//     setInputValue(val)
//     onChange(val)

//     if (debounceRef.current) clearTimeout(debounceRef.current)
//     debounceRef.current = setTimeout(() => fetchAirlines(val), 220)
//   }

//   function handleSelect(option: AirlineOption) {
//     setInputValue(option.name)
//     onChange(option.name) // store full airline name (matches your existing form logic)
//     setOpen(false)
//     setOptions([])
//   }

//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (!open) return
//     if (e.key === "ArrowDown") {
//       e.preventDefault()
//       setActiveIndex((i) => Math.min(i + 1, options.length - 1))
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault()
//       setActiveIndex((i) => Math.max(i - 1, 0))
//     } else if (e.key === "Enter" && activeIndex >= 0) {
//       e.preventDefault()
//       handleSelect(options[activeIndex])
//     } else if (e.key === "Escape") {
//       setOpen(false)
//     }
//   }

//   return (
//     <div ref={wrapperRef} className="relative w-full group">
//       {label && (
//         <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">
//           {label}
//         </label>
//       )}

//       <div className="relative">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onFocus={() => options.length > 0 && setOpen(true)}
//           placeholder={placeholder}
//           autoComplete="off"
//           className="h-10 w-full px-3 bg-transparent outline-none border-b border-gray-200
//                      focus:border-gray-900 transition-colors duration-200
//                      text-gray-900 font-bold
//                      placeholder:text-gray-500 placeholder:font-semibold"
//         />
//         {loading && (
//           <span className="absolute right-2 top-2.5 h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
//         )}
//       </div>

//       <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-900 transition-all duration-300 group-focus-within:w-full" />

//       {open && options.length > 0 && (
//         <ul
//           className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200
//                      rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
//           role="listbox"
//         >
//           {options.map((opt, i) => (
//             <li
//               key={`${opt.iata}-${opt.icao}-${i}`}
//               role="option"
//               aria-selected={i === activeIndex}
//               onMouseDown={() => handleSelect(opt)}
//               onMouseEnter={() => setActiveIndex(i)}
//               className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
//                 ${i === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
//             >
//               <Plane size={14} className="text-gray-400 shrink-0" />
//               <span className="flex-1 min-w-0">
//                 <span className="font-semibold text-gray-900">{opt.name}</span>
//                 {opt.country && (
//                   <span className="text-gray-400 text-xs ml-1.5">{opt.country}</span>
//                 )}
//               </span>
//               {opt.iata && (
//                 <span className="ml-auto font-bold text-green-600 text-xs shrink-0">
//                   {opt.iata}
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useRef, useEffect, useCallback } from "react"

// Clearbit logo API — free, no key needed: https://logo.clearbit.com/{domain}
const AIRLINE_DOMAINS: Record<string, string> = {
  "PK": "piac.com.pk",
  "EK": "emirates.com",
  "BA": "britishairways.com",
  "QR": "qatarairways.com",
  "TK": "turkishairlines.com",
  "U2": "easyjet.com",
  "FR": "ryanair.com",
  "VS": "virginatlantic.com",
  "AF": "airfrance.com",
  "KL": "klm.com",
  "SQ": "singaporeair.com",
  "EY": "etihad.com",
  "FZ": "flydubai.com",
  "G9": "airarabia.com",
  "LH": "lufthansa.com",
  "AP": "airblue.com",
  "PA": "sereneair.com",
}

function AirlineLogo({ iata, name }: { iata: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const domain = iata ? AIRLINE_DOMAINS[iata] : undefined

  if (!domain || failed) {
    const text = iata || name.slice(0, 2).toUpperCase()
    return (
      <span className="h-6 w-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-[9px] font-bold text-gray-500">
        {text}
      </span>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="h-6 w-6 rounded-full object-contain shrink-0 border border-gray-100"
      onError={() => setFailed(true)}
    />
  )
}

interface AirlineOption {
  label: string
  name: string
  iata: string
  icao: string
  country: string
  active: boolean
}

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function AirlineAutocomplete({
  label,
  value,
  onChange,
  placeholder = "Airline name or code",
}: Props) {
  const [inputValue, setInputValue] = useState(value)
  const [options, setOptions] = useState<AirlineOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const fetchAirlines = useCallback(async (q: string) => {
    if (q.length < 2) {
      setOptions([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/airlines?q=${encodeURIComponent(q)}`)
      const data: AirlineOption[] = await res.json()
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
    onChange(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchAirlines(val), 220)
  }

  function handleSelect(option: AirlineOption) {
    setInputValue(option.name)
    onChange(option.name) // store full airline name (matches your existing form logic)
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

      {open && options.length > 0 && (
        <ul
          className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200
                     rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto"
          role="listbox"
        >
          {options.map((opt, i) => (
            <li
              key={`${opt.iata}-${opt.icao}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(opt)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
                ${i === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <AirlineLogo iata={opt.iata} name={opt.name} />
              <span className="flex-1 min-w-0">
                <span className="font-semibold text-gray-900">{opt.name}</span>
                {opt.country && (
                  <span className="text-gray-400 text-xs ml-1.5">{opt.country}</span>
                )}
              </span>
              {opt.iata && (
                <span className="ml-auto font-bold text-green-600 text-xs shrink-0">
                  {opt.iata}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}