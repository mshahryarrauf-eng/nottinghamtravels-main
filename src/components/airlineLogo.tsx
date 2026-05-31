"use client"

import { useState } from "react"
import { getAirlineLogoUrl } from "@/lib/airlineData"

interface Props {
  iata: string
  name?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "h-6 w-6 text-[9px]",
  md: "h-9 w-9 text-[10px]",
  lg: "h-12 w-12 text-xs",
}

export default function AirlineLogo({ iata, name, size = "md" }: Props) {
  const [failed, setFailed] = useState(false)
  const logoUrl = getAirlineLogoUrl(iata)
  const sizeClass = sizeMap[size]

  if (!logoUrl || failed) {
    return (
      <span
        className={`${sizeClass} rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 font-bold text-gray-500`}
      >
        {iata || (name ?? "?").slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={logoUrl}
      alt={name ?? iata}
      className={`${sizeClass} rounded-xl object-contain shrink-0 border border-gray-100 bg-white p-0.5`}
      onError={() => setFailed(true)}
    />
  )
}