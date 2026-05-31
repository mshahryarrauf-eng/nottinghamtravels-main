// src/app/data/destinations.ts
// ─── Edit this file to change the destinations carousel ───────────────────────

export interface Destination {
  id: string
  name: string
  country: string
  tagline: string
  image: string         // put images in /public/destinations/
  href?: string         // optional link — defaults to /destinations
}

export const destinationsData: Destination[] = [
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    tagline: "City of Gold",
    image: "/destinations/dubai.jpg",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    tagline: "Where East Meets West",
    image: "/destinations/istanbul.jpg",
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Indian Ocean",
    tagline: "Paradise on Earth",
    image: "/destinations/maldive.jpg",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    tagline: "Timeless & Electric",
    image: "/destinations/london.jpg",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    tagline: "City of Light",
    image: "/destinations/paris.jpg",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "Island of the Gods",
    image: "/destinations/bali.jpg",
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    tagline: "The City That Never Sleeps",
    image: "/destinations/newyork.jpg",
  },
  {
    id: "makkah",
    name: "Makkah",
    country: "Saudi Arabia",
    tagline: "Spiritual Heart of Islam",
    image: "/destinations/makkah.jpg",
  },
  {
    id: "madinah",
    name: "Madinah",
    country: "Saudi Arabia",
    tagline: "City of the Prophet",
    image: "/destinations/madina.jpg",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    tagline: "Temple & Street Food Capital",
    image: "/destinations/bangkok.jpg",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    tagline: "The Eternal City",
    image: "/destinations/rome.jpg",
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    tagline: "World in One City",
    image: "/destinations/toronto.jpg",
  },
]
