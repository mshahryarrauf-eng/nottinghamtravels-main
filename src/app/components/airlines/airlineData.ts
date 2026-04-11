export interface Airline {
  id: string
  name: string
  country: string
  featured?: boolean
  logo: string
}

export const airlineData: Airline[] = [
  {
    id: "emirates",
    name: "Emirates",
    country: "UAE",
    featured: true,
    logo: "/logos/emirates.png",
  },
  {
    id: "qatar",
    name: "Qatar Airways",
    country: "Qatar",
    featured: true,
    logo: "/logos/qatar.png",
  },
  {
    id: "singapore",
    name: "Singapore Airlines",
    country: "Singapore",
    logo: "/logos/singapur.png",
  },
  {
    id: "pia",
    name: "PIA",
    country: "Pakistan",
    logo: "/logos/pia.png",
  },
  {
    id: "turkish",
    name: "Turkish Airlines",
    country: "Turkey",
    logo: "/logos/turkish.png",
  },
  {
    id: "etihad",
    name: "Etihad Airways",
    country: "UAE",
    logo: "/logos/etihad.png",
  },

  // ✅ New airlines added
  {
    id: "lufthansa",
    name: "Lufthansa",
    country: "Germany",
    logo: "/logos/german.png",
  },
  {
    id: "british",
    name: "British Airways",
    country: "United Kingdom",
    logo: "/logos/british.png",
  },
]