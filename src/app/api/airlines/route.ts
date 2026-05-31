import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rateLimit"

interface Airline {
  name: string
  iata: string
  icao: string
  country: string
  active: boolean
}

let cachedAirlines: Airline[] | null = null

function loadAirlines(): Airline[] {
  if (cachedAirlines) return cachedAirlines

  const filePath = path.join(process.cwd(), "public", "data", "airlines.txt")
  const raw = fs.readFileSync(filePath, "utf-8")

  const airlines: Airline[] = []

  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Parse CSV-style line (fields may be quoted)
    const fields = trimmed.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g)
    if (!fields || fields.length < 8) continue

    const clean = (s: string) => s.replace(/^"|"$/g, "").trim()

    const name    = clean(fields[1])
    const iata    = clean(fields[3])
    const icao    = clean(fields[4])
    const country = clean(fields[6])
    const active  = clean(fields[7]) === "Y"

    // Skip entries with no useful name or both codes missing
    if (!name || name === "Unknown" || (!iata && !icao)) continue
    // Skip entries with placeholder IATA codes
    if (iata === "-" || iata === "N/A") continue

    airlines.push({ name, iata, icao, country, active })
  }

  cachedAirlines = airlines
  return cachedAirlines
}

export async function GET(req: NextRequest) {
  const limit = rateLimit(req, RATE_LIMIT_CONFIGS.general);
  if (!limit.success) return limit.response;

  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase()

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const airlines = loadAirlines()

  const results = airlines
    .filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.iata.toLowerCase().startsWith(q) ||
      a.icao.toLowerCase().startsWith(q) ||
      a.country.toLowerCase().startsWith(q)
    )
    // Prioritise active airlines and exact-start matches on name
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
      if (aStarts !== bStarts) return aStarts - bStarts
      if (a.active !== b.active) return a.active ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    .slice(0, 8)
    .map((a) => ({
      label: a.iata ? `${a.name} — ${a.iata}` : a.name,
      name: a.name,
      iata: a.iata,
      icao: a.icao,
      country: a.country,
      active: a.active,
    }))

  return NextResponse.json(results)
}