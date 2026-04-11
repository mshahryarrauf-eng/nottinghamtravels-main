// ─────────────────────────────────────────────
//  data/religiousTours.ts
//  Dummy data — replace with MongoDB query later.
//  Shape matches a MongoDB document.
// ─────────────────────────────────────────────

export type ReligiousTour = {
  _id: string
  title: string
  category: "hajj" | "umrah" | "other"
  religion?: string        // e.g. "Christian", "Hindu", "Buddhist" — for "other" tours
  destination: string
  duration: string         // e.g. "14 Nights / 15 Days"
  departureDates: string[] // e.g. ["15 Jun 2025", "22 Jul 2025"]
  startingPrice: number
  currency: string
  inclusions: {
    visa: boolean
    flights: boolean
    hotel: boolean
    transport: boolean
  }
  description: string
  image: string
  featured: boolean
  tag?: string             // e.g. "Limited Seats", "Early Bird"
}

export const religiousToursData: ReligiousTour[] = [
  {
    _id: "1",
    title: "Hajj Package — Economy",
    category: "hajj",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "21 Nights / 22 Days",
    departureDates: ["10 May 2025", "17 May 2025"],
    startingPrice: 4999,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "A complete Hajj journey covering all pillars with accommodation in Makkah and Madinah, return flights, and full guidance.",
    image: "/religious/hajj.jpg",
    featured: true,
    tag: "Limited Seats",
  },
  {
    _id: "2",
    title: "Hajj Package — Premium",
    category: "hajj",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "21 Nights / 22 Days",
    departureDates: ["10 May 2025"],
    startingPrice: 7999,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "Premium Hajj experience with 5-star hotels close to Masjid Al-Haram, private transfers, and dedicated scholar guidance.",
    image: "/religious/hajj.jpg",
    featured: true,
    tag: "5-Star",
  },
  {
    _id: "3",
    title: "Umrah — Economy Package",
    category: "umrah",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "10 Nights / 11 Days",
    departureDates: ["01 Jun 2025", "15 Jun 2025", "01 Jul 2025"],
    startingPrice: 1299,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "Affordable Umrah package with 4-star accommodation, return flights from London, and Umrah visa included.",
    image: "/religious/umrah.jpg",
    featured: false,
    tag: "Best Value",
  },
  {
    _id: "4",
    title: "Umrah — Ramadan Special",
    category: "umrah",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "14 Nights / 15 Days",
    departureDates: ["01 Mar 2025", "10 Mar 2025", "20 Mar 2025"],
    startingPrice: 2199,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "Perform Umrah during the blessed month of Ramadan with extended stay, 5-star hotels, and Suhoor & Iftar arrangements.",
    image: "/religious/umrah.jpg",
    featured: true,
    tag: "Ramadan",
  },
  {
    _id: "5",
    title: "Holy Land Pilgrimage",
    category: "other",
    religion: "Christian",
    destination: "Jerusalem, Israel & Palestine",
    duration: "10 Nights / 11 Days",
    departureDates: ["20 Apr 2025", "25 May 2025"],
    startingPrice: 2499,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "Walk in the footsteps of Jesus through Jerusalem, Bethlehem, Nazareth, and the Sea of Galilee with expert guides.",
    image: "/religious/jerusalem.jpg",
    featured: true,
    tag: "Popular",
  },
  {
    _id: "6",
    title: "Char Dham Yatra",
    category: "other",
    religion: "Hindu",
    destination: "Uttarakhand, India",
    duration: "12 Nights / 13 Days",
    departureDates: ["05 May 2025", "19 May 2025", "02 Jun 2025"],
    startingPrice: 1899,
    currency: "GBP",
    inclusions: { visa: false, flights: true, hotel: true, transport: true },
    description:
      "Complete the sacred Char Dham circuit — Yamunotri, Gangotri, Kedarnath, and Badrinath — with comfortable travel and stays.",
    image: "/religious/india.jpg",
    featured: false,
  },
  {
    _id: "7",
    title: "Buddhist Sacred Circuit",
    category: "other",
    religion: "Buddhist",
    destination: "Lumbini, Bodh Gaya & Sarnath",
    duration: "9 Nights / 10 Days",
    departureDates: ["10 Jun 2025", "08 Jul 2025"],
    startingPrice: 1699,
    currency: "GBP",
    inclusions: { visa: false, flights: true, hotel: true, transport: true },
    description:
      "Journey through the most sacred Buddhist sites — birthplace of the Buddha, the Bodhi Tree, and the Deer Park at Sarnath.",
    image: "/religious/buddha.webp",
    featured: false,
    tag: "Spiritual",
  },
  {
    _id: "8",
    title: "Umrah — Family Package",
    category: "umrah",
    destination: "Makkah & Madinah, Saudi Arabia",
    duration: "12 Nights / 13 Days",
    departureDates: ["10 Jul 2025", "24 Jul 2025"],
    startingPrice: 1799,
    currency: "GBP",
    inclusions: { visa: true, flights: true, hotel: true, transport: true },
    description:
      "Specially designed family Umrah package with child-friendly accommodation, flexible group pricing, and full support.",
    image: "/religious/umrah.jpg",
    featured: false,
    tag: "Family",
  },
]