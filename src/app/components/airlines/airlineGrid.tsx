import { Airline } from "./airlineData"
import { AirlineCard } from "./airlineCard"

interface AirlineGridProps {
  airlines: Airline[]
}

export function AirlineGrid({ airlines }: AirlineGridProps) {
  const limitedAirlines = airlines.slice(0, 8 ) // 👈 only 6

  return (
    <div className="border border-neutral-200 bg-neutral-200">
      <div className="grid gap-px grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {limitedAirlines.map((airline, index) => (
          <AirlineCard
            key={airline.id}
            airline={airline}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}