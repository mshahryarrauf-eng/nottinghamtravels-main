export type CabinClass = "Economy" | "Business" | "First"

export type FlightSearchParams = {
  from: string
  to: string
  departureDate: string // ISO format: YYYY-MM-DD
  returnDate?: string
  adults: number
  children: number
  cabin: CabinClass
}
