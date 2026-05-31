import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rateLimit"

// Cache parsed airports in memory so we only read the file once per server boot
let cachedAirports: Airport[] | null = null

interface Airport {
  name: string
  iata_code: string
  municipality: string
  iso_country: string
}

function loadAirports(): Airport[] {
  if (cachedAirports) return cachedAirports

  // airports.csv lives in /public/data/airports.csv — copy it there (see setup notes)
  const csvPath = path.join(process.cwd(), "public", "data", "airports.csv")
  const raw = fs.readFileSync(csvPath, "utf-8")

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[]

  // Only keep airports that have a real IATA code
  cachedAirports = records
    .filter((r) => r.iata_code && r.iata_code.trim().length === 3)
    .map((r) => ({
      name: r.name ?? "",
      iata_code: r.iata_code.trim().toUpperCase(),
      municipality: r.municipality ?? "",
      iso_country: r.iso_country ?? "",
    }))

  return cachedAirports
}

export async function GET(req: NextRequest) {
  const limit = rateLimit(req, RATE_LIMIT_CONFIGS.general);
  if (!limit.success) return limit.response;

  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase()

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const airports = loadAirports()

  // Match against city (municipality), airport name, or IATA code
  const results = airports
    .filter(
      (a) =>
        a.municipality.toLowerCase().startsWith(q) ||
        a.iata_code.toLowerCase().startsWith(q) ||
        a.name.toLowerCase().includes(q)
    )
    .slice(0, 8) // max 8 suggestions
    .map((a) => ({
      label: `${a.municipality || a.name} — ${a.iata_code}`,
      iata: a.iata_code,
      city: a.municipality || a.name,
      name: a.name,
      country: a.iso_country,
    }))

  return NextResponse.json(results)
}